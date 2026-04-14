# Page Flows and Technical Details

This document provides a technical overview of the HMPPS Incident Reporting UI application, detailing page flows, rendering mechanisms, API interactions, and testing strategies.

See also: [Architecture Diagrams](architecture.md) for a visual overview of data flows.

## Page Flows

The application follows several main flows for managing incident reports:

### 1. Dashboard & Navigation
- **Home**: Entry point providing high-level navigation.
- **Dashboard**: Lists incident reports for the user's active caseload(s).
  - Users can filter by status, type, date range, and location.
  - Pagination and sorting are supported.
  - *Technical Detail*: Handled by `dashboard()` controller in `server/routes/dashboard/index.ts`.

### 2. Creating a New Report
The creation journey is a multi-step process using `hmpo-form-wizard`:
1.  **Select Type**: User selects the incident type (e.g., "Assault", "Drone sighting").
2.  **PECS Region Selection** (Data Wardens only): If the user has cross-caseload permissions (PECS), they select a region.
3.  **Basic Details**: User provides the incident date, time, and a brief description.
4.  **Creation**: On successful submission, the report is created in the API, and the user is redirected to either:
    - The report view (`/reports/{reportId}`)
    - The prisoner involvement page (`/create-report/{reportId}/prisoners`) to continue the flow.
  - *Technical Detail*: Managed by `createReportWizardRouter` in `server/routes/reports/details/createReport.ts`.

### 3. Adding Involvements
After the initial report is created, users can add:
- **Prisoners Involved**: Search for and select prisoners, assigning them roles (e.g., "Assailant", "Victim").
- **Staff Involved**: Record staff members present or involved.
  - *Technical Detail*: Routers in `server/routes/reports/prisoners/` and `server/routes/reports/staff/`.

### 4. Incident-Specific Questions
Each incident type has a set of specific questions that must be answered.
- These questions are rendered dynamically using `hmpo-form-wizard`.
- The wizard steps and fields are generated from static configurations in `server/reportConfiguration/types/`.
  - These configurations are largely generated from NOMIS and DPS data using utility scripts in the `scripts/` directory.
  - *Technical Detail*: Middleware `populateReportConfiguration` loads the config and generates steps via `server/data/incidentTypeConfiguration/formWizard.ts`.

### 5. Viewing and Managing Reports
- **View Report**: Displays all details, involvements, and questions.
- **History**: Shows the audit trail and status changes.
- **Actions**: Users with appropriate roles can change the status (e.g., "Submit", "Approve", "Request correction").

---

## Technical Architecture

### Page Rendering
- **Framework**: Express.js (v5) using TypeScript.
- **Templating**: Nunjucks is the primary engine.
- **Components**:
  - **GOV.UK Frontend**: For standard accessible GDS components.
  - **MoJ Frontend**: For Ministry of Justice specific patterns (e.g., header, side navigation).
- **Filters & Globals**: Extensive custom filters in `server/utils/nunjucksSetup.ts` handle date formatting, name casing, and GDS component configuration.

### Form Handling
- **hmpo-form-wizard**: Extensively used for multi-step journeys. It handles session management, validation, and navigation between steps.
- **Dynamic Wizards**: The incident-specific questions use a dynamic implementation of the wizard, where steps are generated at runtime based on the incident type's configuration.

### API Integration
- **Client**: Uses `@ministryofjustice/hmpps-rest-client` for making authenticated requests.
- **Authentication**: Integrates with HMPPS Auth via Passport.js; uses system tokens for background API calls.
- **Incident Reporting API**:
  - Main data source for reports, involvements, and questions.
  - Key client: `IncidentReportingApi` in `server/data/incidentReportingApi.ts`.

#### Key API Endpoints
- `GET /reports`: List reports with filtering.
- `POST /reports`: Create a new report.
- `GET /reports/{id}`: Retrieve full report details.
- `PATCH /reports/{id}`: Update basic report details.
- `GET/POST /reports/{id}/questions`: Manage incident-specific question responses.
- `GET/POST /reports/{id}/prisoners-involved`: Manage prisoner involvements.
- `GET/POST /reports/{id}/staff-involved`: Manage staff involvements.
- `PATCH /reports/{id}/status`: Change report status (e.g., Submit, Approve).

#### Other Integrated APIs
- **Prison API**: For caseload and location information.
- **Offender Search API**: For prisoner details and search.
- **Manage Users API**: For staff details.

---

## Testing Strategy

The project maintains high coverage through two main testing layers:

### 1. Unit Tests (Jest)
- Located alongside the source files (e.g., `*.test.ts`).
- Focuses on business logic in:
  - **Services**: Audit, User, Report Title generation.
  - **Controllers**: Request handling and session state logic.
  - **Middleware**: Permissions, population of report data.
  - **Data Clients**: Verification of API request construction.

### 2. Integration Tests (Cypress)
- Located in `integration_tests/`.
- Uses **WireMock** to stub all external APIs (HMPPS Auth, Incident API, Prison API).
- Covers full end-to-end journeys:
  - Sign-in and authentication.
  - Complete report creation flow.
  - Navigating and filtering the dashboard.
  - Answering dynamic questions for various incident types.
  - Handling error states and validation messages.

### 3. Other Checks
- **Linting**: ESLint for code style and potential errors.
- **Type-checking**: `tsc` to ensure TypeScript correctness.
- **Security**: Periodic audits via `npm audit` and Trivy.
