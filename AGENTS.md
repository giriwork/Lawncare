---
title: Lawn Care Maintenance Application — Agent Instructions
description: Phase-wise development instructions for the React, ASP.NET Core, and SQL Server lawn care maintenance application.
version: "1.0"
authentication_v1: phone-number-only
---

# AGENTS.md — Lawn Care Maintenance Application

## 1. Project Goal

Build a simple, modern, low-maintenance lawn care management application for communities receiving lawn care services.

### Technology

- **Frontend:** React + TypeScript
- **Backend:** C# / ASP.NET Core Web API
- **Database:** Microsoft SQL Server
- **API style:** REST JSON APIs
- **Authentication:** Phone-number-based user access, with secure admin authentication
- **UI:** Responsive, clean, modern, minimal navigation
- **Architecture:** Keep the application modular but avoid unnecessary enterprise complexity.

The application is developed incrementally in phases. Each phase must leave the application working and deployable.

---

# 2. Core Design Principles

1. **Simple first**
   - Prefer straightforward CRUD, validation, and business rules.
   - Do not introduce unnecessary microservices, CQRS, event buses, or complex state management.

2. **Mobile-friendly**
   - Residents may primarily use a phone.
   - Forms should work well on both mobile and desktop.

3. **Minimal maintenance**
   - Centralize configuration.
   - Use database constraints wherever possible.
   - Avoid duplicated business logic between frontend and backend.
   - Keep API contracts explicit.

4. **Server-side validation is mandatory**
   - Frontend validation improves UX.
   - Backend validation is authoritative.

5. **Audit every data-entry action**
   - Every create/update operation must record the phone number of the logged-in user.
   - Admin actions must also record the admin identity.

6. **Admin-only fields must be protected by the API**
   - Hiding an input in React is not sufficient.
   - The backend must reject unauthorized changes.

7. **Avoid hard deletion unless specifically required**
   - Prefer active/inactive flags for master data.
   - Preserve historical service, payment, and enrollment records.

8. **Use consistent naming**
   - Database: PascalCase table/column names or another single convention chosen at project start.
   - API: consistent JSON naming.
   - Frontend: TypeScript interfaces/types matching API contracts.

---

# 3. User Roles

## Resident/User

A resident can:

- Log in using their phone number.
- View their enrollment information.
- Submit/view their service requests.
- View regular lawn service completion information for their community.
- Enter or update permitted enrollment information.
- Submit payment-related information where applicable.

A resident must only see data associated with their authenticated phone number.

## Admin

An admin can:

- Manage communities.
- View/manage lawn care enrollments.
- Review and update payment confirmation.
- Review and update service call status.
- Maintain regular service schedules and completion status.
- View dashboard information.
- Access records across communities.
- Perform administrative corrections where authorized.

### Important security rule

Phone number alone should not be treated as strong authentication for a production system.

The initial version may use phone number login for simplicity, but the design should allow OTP/SMS verification or another secure authentication method to be added without redesigning the application.

---

# 4. Phase 0 — Login

## Goal

Provide a simple login page using the user's phone number.

### UI

- Phone number input.
- Continue/Login button.
- Minimal page with application name/logo.
- Clear validation message for invalid phone numbers.

### Behavior

After login:

- Store the authenticated user context securely.
- Automatically use the logged-in phone number in all applicable forms.
- The user should not repeatedly type their phone number.
- The phone number should be displayed as read-only wherever it is automatically populated.

### Security

Do not trust a phone number supplied by the browser for authorization.

The backend must determine the authenticated user from the authentication mechanism/token.

For an initial simple implementation, use a short-lived authenticated session/token after phone verification.

---

# 5. Phase 1 — Community Master

## Goal

Maintain the list of communities receiving lawn care service.

## Community fields

- CommunityId — Primary Key
- CommunityName
- IsActive
- CreatedAt
- CreatedByPhone
- UpdatedAt
- UpdatedByPhone

### Rules

- CommunityId is unique.
- CommunityName should be required.
- CommunityName should normally be unique.
- Prefer inactive records instead of deleting communities that have historical records.
- Only Admin can create, edit, activate/deactivate communities.

## Admin page

Provide:

- Community list
- Search
- Add Community
- Edit Community
- Activate/Deactivate
- Basic validation

Keep the page simple. Avoid unnecessary filters until they are needed.

---

# 6. Phase 2 — Lawn Care Enrollment

## Goal

Allow a resident to enroll a property for lawn care service.

## Fields

- Community
- FullName
- PhoneNumber
- Email
- StreetAddress
- City
- ZipCode
- Aeration — Yes/No
- CreatedAt
- CreatedByPhone
- UpdatedAt
- UpdatedByPhone

## UI behavior

### Community

- Use a dropdown.
- Show only active communities.

### Phone number

- Automatically populated from the logged-in user.
- Read-only for normal users.

### Address

Display as separate fields:

- Street
- City
- Zip Code

## Duplicate address rule

A property address must not be enrolled more than once within the same community.

The database must enforce this rule.

Recommended unique key:

`CommunityId + normalized address`

Do not rely only on a frontend duplicate check.

### Address normalization

Before duplicate comparison:

- Trim leading/trailing spaces.
- Normalize repeated spaces.
- Use a consistent case for comparison.
- Store the original display address separately if desired.

Example:

`123 Main St` and ` 123  MAIN ST ` should be treated as the same address.

### Enrollment rules

- Resident can create/update their own enrollment.
- Admin can view/update enrollment records.
- Phone number used for the enrollment must be the authenticated phone number unless the user is an authorized admin.
- A resident must not be able to change another resident's enrollment by manipulating an ID in the API.

---

# 7. Phase 3 — Payment Tracking

## Goal

Track payments associated with enrolled properties.

## Fields

- Community
- PhoneNumber
- PropertyAddress
- PaymentDate
- PaymentAmount
- PaymentConfirmation
- CreatedAt
- CreatedByPhone
- UpdatedAt
- UpdatedByPhone

## Rules

### Resident

A resident may:

- View their own payment records.
- Enter permitted payment information.

### Admin

Only Admin can:

- Update PaymentConfirmation.
- Correct payment information when authorized.
- View payment records across communities.

### Important

Payment confirmation must be protected at the API level.

The frontend should not merely hide the field from residents.

---

# 8. Phase 4 — Service Call Request

## Goal

Allow a resident to request lawn service.

## Fields

- Community
- PhoneNumber
- PropertyAddress
- ServiceCallDate
- Reason
- Status
- CreatedAt
- CreatedByPhone
- UpdatedAt
- UpdatedByPhone

## UI behavior

### Community

- Dropdown based on the user's active enrollment.

### Phone number

- Automatically populated from login.
- Read-only.

### Property Address

Automatically populate the property address based on the authenticated phone number.

If a user has multiple enrolled properties, do not guess.

Provide a property/address selector associated with the user's enrollment records.

### Service Call Date

Use a date picker.

### Reason

Use a multiline text area.

### Status

Initial value:

`Pending Schedule`

Recommended status values:

- Pending Schedule
- Scheduled
- In Progress
- Completed
- Cancelled

Only Admin can update status.

The backend must enforce this restriction.

---

# 9. Phase 5 — Regular Service Schedule

## Goal

Allow Admin to maintain regular lawn service schedules.

## Fields

- Community
- ServiceDate
- CompletionStatus
- CreatedAt
- CreatedByPhone
- UpdatedAt
- UpdatedByPhone

## Rules

- Only Admin can create/update regular service schedule records.
- CompletionStatus is controlled by Admin.

Recommended completion statuses:

- Scheduled
- Completed
- Not Completed
- Cancelled

The dashboard should show the regular service status relevant to the user's community.

---

# 10. Phase 6 — Resident Dashboard

## Goal

Provide a simple personalized dashboard after login.

The dashboard is driven by the authenticated phone number.

## Section 1 — Personal Enrollment

Show:

- Full Name
- Phone
- Email
- Community
- Property Address
- Aeration selection

The resident should only see their own information.

## Section 2 — Regular Lawn Service

Show a simple list/table containing:

- Community
- Service Date
- Completion Status

Only show information relevant to the resident's community.

## Section 3 — Service Calls

Show:

- Service Call Date
- Property Address
- Reason
- Status

Only show service calls created by the authenticated resident/phone number.

## Dashboard layout

Desktop:

- Personal enrollment card
- Regular service list and service call list side-by-side where screen width permits

Mobile:

- Stack the sections vertically.

Do not make the dashboard visually complicated.

---

# 11. Recommended Navigation

## Resident

- Dashboard
- My Enrollment
- Service Request
- Payments
- Logout

## Admin

- Dashboard
- Communities
- Enrollments
- Payments
- Service Calls
- Regular Schedule
- Logout

Only show navigation items that the current role is authorized to access.

---

# 12. Suggested Database Model

Use relational tables with foreign keys.

## Communities

```text
Communities
-----------
CommunityId PK
CommunityName
IsActive
CreatedAt
CreatedByPhone
UpdatedAt
UpdatedByPhone
```

## Enrollments

```text
Enrollments
-----------
EnrollmentId PK
CommunityId FK
FullName
PhoneNumber
Email
StreetAddress
City
ZipCode
NormalizedAddress
Aeration
CreatedAt
CreatedByPhone
UpdatedAt
UpdatedByPhone
```

Recommended unique constraint:

```text
UNIQUE(CommunityId, NormalizedAddress)
```

## Payments

```text
Payments
--------
PaymentId PK
EnrollmentId FK
PaymentDate
PaymentAmount
PaymentConfirmation
CreatedAt
CreatedByPhone
UpdatedAt
UpdatedByPhone
```

Use `decimal(10,2)` or an appropriate SQL Server decimal type for PaymentAmount.

## ServiceCallRequests

```text
ServiceCallRequests
-------------------
ServiceCallRequestId PK
EnrollmentId FK
ServiceCallDate
Reason
Status
CreatedAt
CreatedByPhone
UpdatedAt
UpdatedByPhone
```

## RegularServiceSchedules

```text
RegularServiceSchedules
-----------------------
RegularServiceScheduleId PK
CommunityId FK
ServiceDate
CompletionStatus
CreatedAt
CreatedByPhone
UpdatedAt
UpdatedByPhone
```

## Users / Authentication

If authentication is persisted in the database:

```text
Users
-----
UserId PK
PhoneNumber
Role
IsActive
CreatedAt
UpdatedAt
```

For production, use a secure authentication mechanism and do not store authentication secrets in plain text.

---

# 13. Database Constraints

Use SQL Server constraints for critical business rules.

At minimum:

- Primary keys
- Foreign keys
- Required fields
- Unique community name
- Unique community + normalized address
- Valid relationships
- Appropriate decimal precision for payment amount

Do not depend entirely on React validation.

---

# 14. Backend Architecture

Recommended ASP.NET Core structure:

```text
LawnCare.Api/
  Controllers/
  Services/
  Repositories/
  Data/
  Models/
  DTOs/
  Validation/
  Authentication/
  Authorization/
  Migrations/
  Program.cs
  appsettings.json
```

Keep the architecture lightweight.

### Controllers

Responsible for:

- HTTP requests
- Authorization
- Input/output DTOs
- Calling application services

Do not put large amounts of business logic in controllers.

### Services

Responsible for:

- Business rules
- Duplicate address checks
- Authorization-sensitive operations
- Data orchestration

### Repositories / Data layer

Responsible for:

- SQL Server access
- EF Core queries
- Transactions where necessary

Entity Framework Core is recommended unless there is a strong project-specific reason to use another data access approach.

---

# 15. API Design

Use REST endpoints with predictable naming.

Examples:

```text
GET    /api/communities
POST   /api/communities
PUT    /api/communities/{id}
PATCH  /api/communities/{id}/status

GET    /api/enrollments/me
POST   /api/enrollments
PUT    /api/enrollments/{id}

GET    /api/payments/me
POST   /api/payments
PUT    /api/payments/{id}/confirmation

GET    /api/service-calls/me
POST   /api/service-calls
PUT    /api/service-calls/{id}/status

GET    /api/regular-services/community/{communityId}
POST   /api/regular-services
PUT    /api/regular-services/{id}

GET    /api/dashboard
```

The exact routes can be adjusted as implementation progresses, but keep them consistent.

---

# 16. API Authorization

Every endpoint must explicitly define who can access it.

Example:

```text
Resident:
  GET /api/dashboard
  GET /api/enrollments/me
  POST /api/service-calls
  GET /api/service-calls/me
  GET /api/payments/me

Admin:
  Full community management
  Full enrollment management
  Payment confirmation management
  Service call status management
  Regular service management
```

Never use a client-provided `PhoneNumber` as the sole authorization mechanism.

The server must derive the current user from the authenticated identity.

---

# 17. React Frontend Architecture

Recommended structure:

```text
src/
  api/
  components/
  layouts/
  pages/
    auth/
    dashboard/
    communities/
    enrollments/
    payments/
    service-calls/
    regular-services/
  hooks/
  types/
  utils/
  routes/
  App.tsx
  main.tsx
```

## UI principles

- Use a consistent spacing system.
- Use cards for important summaries.
- Use tables for admin data.
- Use forms with clear labels.
- Use inline validation messages.
- Use confirmation dialogs for destructive/admin actions.
- Keep primary actions obvious.
- Avoid excessive animations.
- Avoid unnecessary modal dialogs.
- Use responsive layouts.

---

# 18. Form Behavior

All forms should:

1. Load required dropdown data.
2. Automatically populate authenticated phone number.
3. Disable editing of system-controlled fields.
4. Validate required fields.
5. Display friendly validation errors.
6. Prevent duplicate submissions.
7. Show a clear success message.
8. Refresh relevant data after successful submission.

For API failures, display a useful message instead of raw server errors.

---

# 19. Audit / User Trace

Every important record should contain:

```text
CreatedAt
CreatedByPhone
UpdatedAt
UpdatedByPhone
```

The backend should populate these fields from the authenticated user.

Do not trust values supplied by the React client.

For admin operations, record the admin phone number in `CreatedByPhone` or `UpdatedByPhone` as appropriate.

If stronger auditing is required later, add:

```text
AuditLog
--------
AuditLogId
UserPhone
Action
EntityName
EntityId
OldValue
NewValue
CreatedAt
```

Do not add a full audit-log subsystem unless the project actually requires it.

---

# 20. Error Handling

Backend should return consistent errors.

Recommended format:

```json
{
  "message": "The property address is already enrolled in this community.",
  "code": "DUPLICATE_ADDRESS"
}
```

Frontend should translate known error codes into friendly messages.

Never expose:

- SQL exceptions
- Stack traces
- Connection strings
- Secrets
- Internal infrastructure details

to normal users.

---

# 21. Logging

Use ASP.NET Core structured logging.

Log:

- Authentication failures
- Authorization failures
- Unexpected exceptions
- Important admin operations
- API errors

Do not log sensitive authentication information or unnecessary personal data.

---

# 22. Configuration

Keep environment-specific values outside source code.

Examples:

```text
ConnectionStrings__DefaultConnection
Authentication settings
SMS/OTP provider settings
Allowed origins
```

Use:

- Development configuration
- Production environment variables/secrets

Never commit passwords, connection strings containing credentials, API keys, or tokens.

---

# 23. Phase Development Rules

Implement one phase at a time.

For each phase:

1. Create/update database model.
2. Create migration.
3. Implement backend API.
4. Add authorization.
5. Implement React page.
6. Add validation.
7. Add audit fields.
8. Test backend.
9. Test frontend.
10. Verify existing phases still work.

Do not begin the next phase until the current phase has a working end-to-end flow.

---

# 24. Phase Acceptance Criteria

## Phase 0

- User can log in.
- Authenticated phone is available to backend.
- Phone automatically appears in relevant forms.
- Unauthorized users cannot access protected APIs.

## Phase 1

- Admin can add/edit/deactivate communities.
- Community names cannot duplicate.
- Active communities appear in dropdowns.

## Phase 2

- User can enroll.
- Community is selectable.
- Phone is automatically populated.
- Address fields are captured.
- Duplicate address within the same community is rejected.
- Database also enforces duplicate prevention.

## Phase 3

- Payment can be recorded.
- Payment amount/date are validated.
- Admin can update payment confirmation.
- Resident cannot modify payment confirmation.

## Phase 4

- User can create service call.
- Property address is derived from enrollment.
- Initial status is `Pending Schedule`.
- Admin can update status.
- Resident cannot change status.

## Phase 5

- Admin can create/update regular service schedule.
- Admin can update completion status.
- Community relationship is enforced.

## Phase 6

- Dashboard uses authenticated phone.
- Resident sees their enrollment.
- Resident sees relevant community service completion.
- Resident sees their service calls and statuses.
- No cross-user data leakage.

---

# 25. Testing Strategy

At minimum, implement:

## Backend tests

- Community CRUD authorization
- Duplicate community validation
- Duplicate enrollment address
- Enrollment ownership
- Payment confirmation admin-only rule
- Service call default status
- Service call status admin-only rule
- Regular service admin-only rule
- Dashboard filtering by authenticated phone

## Frontend tests

- Login flow
- Form validation
- Phone auto-fill
- Community dropdown
- Duplicate-address error display
- Service request flow
- Dashboard rendering
- Admin-only controls

## Security tests

Verify that changing IDs or request payloads cannot expose another user's:

- Enrollment
- Address
- Payment
- Service call

This is especially important because the application uses phone-based user access.

---

# 26. UX Recommendations

The application should feel like a simple business utility, not a complicated enterprise application.

Recommended visual hierarchy:

```text