# Lawncare project plan

Follow AGENTS.md. Implement one phase at a time and keep the repository working between phases.

## Phase 0 — Authentication foundation (current)

- [x] React + TypeScript sign-in screen with accessible phone input and client-side format validation
- [x] ASP.NET Core API project and health endpoint
- [x] Typed frontend API boundary and Vite development proxy
- [ ] Choose and configure a phone-verification provider (OTP/SMS)
- [ ] Implement rate-limited OTP request and verification endpoints
- [ ] Issue and validate a short-lived secure session/token after successful verification
- [ ] Add tests for invalid phone numbers, verification flow, expiry, and unauthorized access
- [ ] Verify a resident cannot access another resident's records

**Security note:** A phone number entered into a form is not authentication. The current login endpoint intentionally returns 501 until verification is configured. Do not treat the UI as production-ready.

## Planned phases (do not implement before Phase 0 is accepted)

1. **Community master:** admin-only create/edit/activate/deactivate; unique community names.
2. **Enrollment:** residents enroll properties; normalize address and enforce unique (CommunityId, NormalizedAddress) in SQL Server.
3. **Payment tracking:** record payments; admin-only payment confirmation.
4. **Service requests:** residents request service for one of their enrolled properties; admin controls status.
5. **Regular service schedule:** admin maintains community service dates and completion status.
6. **Resident dashboard:** show only the authenticated resident's enrollment and service information.

## Decisions needed for Phase 0

- Select an SMS/OTP provider and deployment environment.
- Decide whether the API will use secure HTTP-only cookies or short-lived bearer tokens.
- Define administrator provisioning and secure admin authentication.
- Configure allowed frontend origins for local and production environments.

## Local checks

~~~bash
npm install
npm run build
dotnet build server/LawnCare.Api/LawnCare.Api.csproj
dotnet run --project server/LawnCare.Api
~~~

The health endpoint is GET /api/health. Real sign-in remains blocked until the verification flow is implemented.
