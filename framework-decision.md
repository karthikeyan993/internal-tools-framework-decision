# Framework decision for internal tools

**Date:** 9 September 2026
**Recommendation:** React + Vite for a CSR frontend; Fastify with TypeScript as the preferred backend. NestJS remains an alternative; final adoption is proposed in ADR 0001.
**Scope:** Our initial admin panel and similar internal business tools.

## What we considered

The original team context is four people: two interns and two experienced developers, with Python experience and basic JavaScript knowledge. The clarified scope is TypeScript-only, fully AI-driven development for company-only tools, primarily on GCP Cloud Run and Cloud Run functions, with IAP for authentication. Expected user count is fewer than 10,000.

See the [Fastify](docs/blueprints/fastify.md) and [NestJS](docs/blueprints/nestjs.md) starter designs, [shared architecture](docs/architecture.md), and [proposed ADR](docs/adr/0001-typescript-cloud-run-starter.md). These are designs, not a runnable or production-validated application.

Our priorities are understandable code, consistent implementation, straightforward maintenance, and one primary application language. User count alone does not establish capacity requirements: concurrent activity, database queries, and workload still need to be measured.

This is an architecture recommendation based on our requirements and framework documentation, not the result of an implementation benchmark or security audit.

## The selected stack

| Part | Choice | Responsibility |
| --- | --- | --- |
| Frontend | React + TypeScript | Admin screens, forms, tables, and user interactions |
| Frontend tooling | Vite | Local development and production frontend builds |
| Backend | Fastify + TypeScript on Node.js | APIs, input validation, permissions, business rules, and database access |

React is a UI library, Vite is a build tool, and Fastify is the backend framework. Together they form our application stack. React documents Vite as an option for building an application, while noting that routing and data fetching require additional choices. [React documentation](https://react.dev/learn/build-a-react-app-from-scratch)

## Why we are choosing it

1. **One primary application language.** TypeScript across frontend and backend reduces language switching and lets us standardize tooling and share suitable API types. Shared types must be deliberately maintained; runtime input validation remains necessary.
2. **An explicit request flow.** The UI calls an API, and the API performs validation, permissions checks, business logic, and database operations. We expect this separation to make debugging and reviewing generated code easier for this team.
3. **A direct structure for inspection.** Routes, functions, schemas, and plugins can keep the request flow explicit. With AI generating code, reduced typing and boilerplate are not major decision drivers; the team still needs to understand and debug the result.
4. **Useful API foundations.** Fastify supports TypeScript and schema-based request validation and response serialization. These provide a foundation for consistent API contracts. [TypeScript support](https://fastify.dev/docs/latest/Reference/TypeScript/), [validation and serialization](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/)
5. **A reusable team starter.** A reviewed example and agreed conventions can give developers and AI agents a consistent pattern across similar tools.

## Alternatives and why we are not selecting them now

These are suitability judgments for our current team and application, not claims that the alternatives are poor frameworks.

| Option | Why we considered it | Why we are not selecting it now | When to reconsider |
| --- | --- | --- | --- |
| **React + Vite + NestJS** | Built-in architectural conventions and dependency injection can improve consistency across generated features | We prefer a direct structure with a maintained starter; Nest's framework concepts remain a debugging cost even when agents write the code | Complex business modules or multiple teams make prescribed conventions more valuable |
| **React + Vite + Hono** | Small routing API, TypeScript support, and portability across JavaScript runtimes | Also meets our single-language goal, but we prefer Fastify's integrated schema validation, response serialization, and structured logging for our Node.js API. Runtime portability is not currently a requirement | We need Cloudflare Workers or multiple runtimes, or a prototype shows Hono is easier for the team to maintain |
| **Next.js** | Integrated React framework with server capabilities and routing | SSR is not currently a firm requirement; its rendering and caching model adds concepts to manage | React SSR becomes mandatory; then evaluate Next.js and React Router Framework Mode |

NestJS adds an architectural layer over Express or Fastify. Next.js supports server-rendered UI composed with interactive Client Components. [NestJS introduction](https://docs.nestjs.com/), [Next.js rendering model](https://nextjs.org/docs/app/getting-started/server-and-client-components)

**NestJS is the main structured-backend alternative.** Python frameworks are outside the current shortlist. No evidence here establishes that a particular framework generates better AI-written code; our preference assumes a maintained starter and meaningful verification.

### Hono versus Fastify

Hono is a credible TS backend alternative, including for ordinary Node.js deployments through its adapter. Its use of Web Standards also supports runtimes such as Cloudflare Workers, Bun, and Deno. Its typed RPC client is useful even without runtime portability requirements. [Hono overview](https://hono.dev/docs/), [Node.js support](https://hono.dev/docs/getting-started/nodejs), [Hono RPC](https://hono.dev/docs/guides/rpc)

The distinction is how we assemble API behavior. Hono provides a thin validator and recommends integrating a validation library; Fastify provides a schema-based validation and serialization path, plus integrated Pino logging when enabled. For this project, we prefer that combination as our starting convention. Both still need application structure and permissions designed by the team. [Hono validation](https://hono.dev/docs/guides/validation), [Fastify validation](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/), [Fastify logging](https://fastify.dev/docs/latest/Reference/Logging/)

We are not excluding Hono on security, capacity, or AI compatibility grounds; we have not established a disadvantage in those areas. Its minimal API could be easier for some developers, so this is a project-fit preference rather than a universal ranking.

## Tradeoffs we must own

- **We define the conventions.** Fastify does not supply a complete business-application architecture. We must standardize folders, validation, errors, database access, frontend routing, and data fetching.
- **There are separate frontend and backend builds.** Deployment and API integration need an agreed setup, even if both live in one repository.
- **TypeScript still requires learning JavaScript.** Everyone needs to understand asynchronous code, errors, modules, and the browser/server boundary.
- **Security remains an application responsibility.** With IAP, access can be controlled at the application boundary; our backend still needs business permissions and record-level access checks. We must maintain dependencies and review sensitive changes. [IAP overview](https://docs.cloud.google.com/iap/docs/concepts-overview)

## How we will introduce it

Build one complete admin workflow first: list records, edit a record, validate input, enforce permissions, and show errors. Review it with all four developers before using it as the starter for other tools.

Give agents the approved structure and example in repository instructions. Require strict TypeScript checks, a production build, and meaningful tests for permissions and business rules. A developer must understand and review each change; AI-generated code is not evidence that the change is correct.

Propose this as the default for similar internal applications, subject to the ADR and first-workflow validation. Revisit the decision if team experience, workload, or application requirements materially change. A monorepo supports either backend; begin with one deployment per website and split only where access, ownership, or releases require it.
