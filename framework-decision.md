# Framework decision for internal tools

**Date:** 9 September 2026  
**Decision:** React + Vite for the frontend; Fastify with TypeScript for the backend.  
**Scope:** Our initial admin panel and similar internal business tools.

## What we considered

We are a four-person team: two interns and two experienced developers. Everyone knows Python, with basic JavaScript knowledge. We expect fewer than 10,000 users and will use AI agents throughout development.

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
3. **A relatively small backend learning surface.** We can start with routes, functions, schemas, and plugins without adopting NestJS's dependency-injection architecture.
4. **Useful API foundations.** Fastify supports TypeScript and schema-based request validation and response serialization. These provide a foundation for consistent API contracts. [TypeScript support](https://fastify.dev/docs/latest/Reference/TypeScript/), [validation and serialization](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/)
5. **A reusable team starter.** A reviewed example and agreed conventions can give developers and AI agents a consistent pattern across similar tools.

## Alternatives and why we are not selecting them now

These are suitability judgments for our current team and application, not claims that the alternatives are poor frameworks.

| Option | Why we considered it | Why we are not selecting it now | When to reconsider |
| --- | --- | --- | --- |
| **React + Vite + FastAPI** | Strong fit with our existing Python knowledge; validation and automatic API documentation | We are choosing TypeScript as the shared frontend/backend language. FastAPI would introduce a Python backend toolchain and a cross-language API contract | Python libraries or existing services become central, or the team's TS learning cost outweighs standardization benefits |
| **React + Vite + NestJS** | Built-in architectural conventions and dependency injection can improve consistency | Modules, decorators, providers, and dependency injection add concepts to learn before our first admin panel. We prefer a smaller starting structure | Growing backend complexity makes framework-enforced conventions more valuable |
| **React + Vite + Hono** | Small routing API, TypeScript support, and portability across JavaScript runtimes | Also meets our single-language goal, but we prefer Fastify's integrated schema validation, response serialization, and structured logging for our Node.js API. Runtime portability is not currently a requirement | We need Cloudflare Workers or multiple runtimes, or a prototype shows Hono is easier for the team to maintain |
| **Next.js** | Integrated React framework with server capabilities and routing | Its App Router introduces Server/Client Component boundaries and rendering behavior. Our initial interactive admin tool does not establish a strong need for that additional model | We need server-rendered pages, public-facing content, or a team experienced with Next.js |

FastAPI provides validation and OpenAPI-based documentation using Python types. NestJS adds an architectural layer over Express or Fastify. Next.js supports server-rendered UI composed with interactive Client Components. [FastAPI features](https://fastapi.tiangolo.com/features/), [NestJS introduction](https://docs.nestjs.com/), [Next.js rendering model](https://nextjs.org/docs/app/getting-started/server-and-client-components)

**FastAPI is our strongest alternative.** The decision accepts an upfront TypeScript learning cost to pursue longer-term language consistency. We are not rejecting Python because of scale or security.

### Hono versus Fastify

Hono is a credible TS backend alternative, including for ordinary Node.js deployments through its adapter. Its use of Web Standards also supports runtimes such as Cloudflare Workers, Bun, and Deno. [Hono overview](https://hono.dev/docs/), [Node.js support](https://hono.dev/docs/getting-started/nodejs)

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

Use this as our default for similar internal applications. Revisit the decision if team experience, workload, or application requirements materially change.
