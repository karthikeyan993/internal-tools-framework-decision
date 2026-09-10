import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import type {
  AccessRequest,
  ApiErrorResponse,
  DemoRole,
  RequestListResponse,
  RequestStatus,
  ReviewDecision,
  SummaryResponse
} from '@comparison/contracts';

const statusLabels: Record<RequestStatus, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

async function readJson<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T | ApiErrorResponse;
  if (!response.ok) {
    const apiError = body as ApiErrorResponse;
    throw new Error(apiError.error?.message ?? 'The request failed.');
  }
  return body as T;
}

export function App() {
  const [role, setRole] = useState<DemoRole>('reviewer');
  const [queryDraft, setQueryDraft] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<RequestStatus | ''>('');
  const [list, setList] = useState<RequestListResponse | null>(null);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState<ReviewDecision | null>(null);

  const headers = useMemo(() => ({ 'x-demo-role': role }), [role]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ page: '1', pageSize: '20' });
    if (query) params.set('query', query);
    if (status) params.set('status', status);

    try {
      const [nextList, nextSummary] = await Promise.all([
        fetch(`/api/requests?${params}`, { headers }).then(readJson<RequestListResponse>),
        fetch('/api/summary', { headers }).then(readJson<SummaryResponse>)
      ]);
      setList(nextList);
      setSummary(nextSummary);
      setSelectedId((current) => {
        if (current && nextList.items.some((item) => item.id === current)) return current;
        return nextList.items[0]?.id ?? null;
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'The requests could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [headers, query, status]);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = list?.items.find((item) => item.id === selectedId) ?? null;

  function applyFilters(event: FormEvent) {
    event.preventDefault();
    setQuery(queryDraft.trim());
  }

  async function review(decision: ReviewDecision) {
    if (!selected) return;
    setSaving(decision);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(`/api/requests/${selected.id}/review`, {
        method: 'PATCH',
        headers: { ...headers, 'content-type': 'application/json' },
        body: JSON.stringify({ decision, note, version: selected.version })
      });
      const updated = await readJson<AccessRequest>(response);
      setNotice(`${updated.requesterName}'s request was ${statusLabels[updated.status]!.toLowerCase()}.`);
      setNote('');
      await load();
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : 'The review could not be saved.');
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand"><span className="brand-mark">AR</span><span>Admin review</span></div>
        <nav><a className="nav-item active" href="#requests" aria-current="page">Access requests</a></nav>
        <div className="role-switcher">
          <label htmlFor="demo-role">Demo identity</label>
          <select id="demo-role" value={role} onChange={(event) => setRole(event.target.value as DemoRole)}>
            <option value="reviewer">Reviewer</option>
            <option value="viewer">Viewer</option>
          </select>
          <small>Sent as a demo header; not production authentication.</small>
        </div>
      </aside>

      <main id="main" className="content">
        <header className="page-header">
          <div><p className="eyebrow">Internal operations</p><h1>Access requests</h1><p>Review employee access to business systems.</p></div>
          <button className="secondary-button" type="button" onClick={() => void load()} disabled={loading}>Refresh</button>
        </header>

        <section className="metrics" aria-label="Request summary">
          {(['pending', 'approved', 'rejected'] as const).map((metric) => (
            <article className="metric" key={metric}>
              <span>{{ pending: 'Pending', approved: 'Approved', rejected: 'Rejected' }[metric]}</span>
              <strong>{summary ? summary[metric] : '—'}</strong>
            </article>
          ))}
        </section>

        {summary && <p className="freshness">Updated {new Date(summary.generatedAt).toLocaleString()} (local time)</p>}
        <div className="status-region" aria-live="polite">
          {error && <div className="alert error"><strong>Something went wrong.</strong> {error} <button type="button" onClick={() => void load()}>Retry</button></div>}
          {notice && <div className="alert success">✓ {notice}</div>}
        </div>

        <form className="filters" onSubmit={applyFilters}>
          <label>Search<input value={queryDraft} onChange={(event) => setQueryDraft(event.target.value)} placeholder="Name, email, or system" /></label>
          <label>Status<select value={status} onChange={(event) => setStatus(event.target.value as RequestStatus | '')}><option value="">All statuses</option>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
          <button className="primary-button" type="submit">Apply filters</button>
        </form>

        <div className="workspace" id="requests">
          <section className="panel list-panel" aria-labelledby="results-title">
            <div className="panel-heading"><h2 id="results-title">Requests</h2><span>{list?.total ?? 0} results</span></div>
            {loading ? <div className="state">Loading requests…</div> : list?.items.length === 0 ? <div className="state"><strong>{query || status ? 'No matching requests' : 'No requests yet'}</strong><p>{query || status ? 'Change the filters and try again.' : 'New access requests will appear here.'}</p></div> : (
              <div className="table-wrap"><table><thead><tr><th>Requester</th><th>System</th><th>Status</th><th>Updated</th></tr></thead><tbody>{list?.items.map((item) => (
                <tr key={item.id} className={item.id === selectedId ? 'selected-row' : ''}>
                  <td><button className="row-button" type="button" onClick={() => { setSelectedId(item.id); setNotice(null); }}><strong>{item.requesterName}</strong><span>{item.requesterEmail}</span></button></td>
                  <td>{item.systemName}</td><td><span className={`badge ${item.status.toLowerCase()}`}>{statusLabels[item.status]}</span></td><td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}</tbody></table></div>
            )}
          </section>

          <section className="panel detail-panel" aria-labelledby="detail-title">
            {!selected ? <div className="state"><strong>Select a request</strong><p>Request details and review actions appear here.</p></div> : <>
              <div className="panel-heading"><div><span className={`badge ${selected.status.toLowerCase()}`}>{statusLabels[selected.status]}</span><h2 id="detail-title">{selected.requesterName}</h2></div><span>v{selected.version}</span></div>
              <dl><div><dt>Email</dt><dd>{selected.requesterEmail}</dd></div><div><dt>System</dt><dd>{selected.systemName}</dd></div><div className="full"><dt>Business reason</dt><dd>{selected.reason}</dd></div>{selected.reviewerNote && <div className="full"><dt>Reviewer note</dt><dd>{selected.reviewerNote}</dd></div>}</dl>
              {selected.status === 'PENDING' ? <div className="review-form"><label htmlFor="review-note">Reviewer note<span>Required</span></label><textarea id="review-note" rows={4} maxLength={500} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Explain the decision" />{role === 'viewer' && <p className="permission-note">Viewer role can inspect requests but cannot review them.</p>}<div className="actions"><button className="danger-button" type="button" disabled={role !== 'reviewer' || note.trim().length < 3 || saving !== null} onClick={() => void review('REJECTED')}>{saving === 'REJECTED' ? 'Rejecting…' : 'Reject'}</button><button className="primary-button" type="button" disabled={role !== 'reviewer' || note.trim().length < 3 || saving !== null} onClick={() => void review('APPROVED')}>{saving === 'APPROVED' ? 'Approving…' : 'Approve'}</button></div></div> : <p className="completed-note">This request has already been reviewed.</p>}
            </>}
          </section>
        </div>
      </main>
    </div>
  );
}
