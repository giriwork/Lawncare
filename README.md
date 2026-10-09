# Lawncare

A responsive lawn care maintenance application for communities receiving lawn services. Residents will access enrollment, payment information, service requests, and community service updates; administrators will manage records.

**Project instructions:** Read AGENTS.md before making changes. Development is phase-based; complete and verify one phase before starting the next.

## Technology stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** C# + ASP.NET Core Web API (.NET 10)
- **Database:** Microsoft SQL Server, introduced with the first data-backed phase
- **Data access:** Entity Framework Core when database work begins
- **API:** REST endpoints with JSON
- **Authentication:** Phone-based sign-in with verified identity; an OTP/SMS provider must be configured before real login is enabled

## Repository layout

~~~text
Lawncare/
├── AGENTS.md
├── docs/project-plan.md
├── src/
│   ├── api/client.ts
│   ├── types/auth.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── server/LawnCare.Api/
│   ├── Properties/launchSettings.json
│   ├── Program.cs
│   └── LawnCare.Api.csproj
├── index.html
├── package.json
└── vite.config.ts
~~~

## Prerequisites

- Node.js 22.12+ and npm
- .NET 10 SDK
- SQL Server when database-backed features are introduced

## Run the frontend

~~~bash
npm install
npm run dev
~~~

Vite prints the local URL. The frontend proxies /api requests to http://localhost:5080.

## Run the API

From the repository root:

~~~bash
dotnet run --project server/LawnCare.Api
~~~

Health check: http://localhost:5080/api/health

The login endpoint intentionally remains unavailable until a real phone-verification provider and secure token/session flow are configured. A phone number by itself is not proof of identity, and the app must not create an authenticated session based only on a number typed into the browser.

## Current milestone

**Phase 0 — Authentication foundation.** This starter establishes the frontend login shell and API boundary. Secure login is not complete until verification is implemented and tested. Community management and later phases must wait until this phase is complete.

See docs/project-plan.md for the acceptance checklist and next steps.
