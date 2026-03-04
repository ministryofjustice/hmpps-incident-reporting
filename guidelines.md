# Project Guidelines

## Project Overview
HMPPS Incident Reporting UI is a front-end application used by staff in HMPPS prisons to view and submit incident reports. It is a Node.js Express application written in TypeScript, using GDS (Government Design System) components and MoJ-specific patterns.

The application is backed by the `hmpps-incident-reporting-api` and integrates with various other HMPPS services like HMPPS Auth, Prison API, and Offender Search.

## Project Structure
- `server/`: Main application source code.
    - `app.ts`: Express application initialization.
    - `routes/`: Route definitions.
    - `controllers/`: Request handlers.
    - `services/`: Business logic.
    - `data/`: API clients and data access.
    - `middleware/`: Express middleware.
    - `reportConfiguration/`: Incident type specific configurations (generated from external sources).
    - `views/`: Nunjucks templates.
- `assets/`: Static assets (JS, CSS, images).
- `integration_tests/` & `cypress/`: Cypress integration tests.
- `scripts/`: Utility scripts for importing configurations and updating incident types.
- `helm_deploy/`: Helm charts for Kubernetes deployment.

## Tech Stack
- **Language:** TypeScript
- **Framework:** Express.js (v5)
- **Templates:** Nunjucks
- **Frontend Components:** GOV.UK Frontend, MoJ Frontend
- **Build Tool:** esbuild
- **Testing:** Jest (unit), Cypress (integration)
- **Containerization:** Docker & Docker Compose

## Testing Strategy
- **Unit Tests:** Run with `npm test`. These use Jest and should cover business logic in services, controllers, and utilities.
- **Integration Tests:** Run with `npm run int-test`. These use Cypress. To run locally, you typically need to:
    1. Start test dependencies: `docker compose -f docker-compose-test.yml up`
    2. Start the app in feature mode: `npm run start-feature`
    3. Run tests: `npm run int-test` (or `npm run int-test-ui` for the Cypress UI).
- **Linting:** Run `npm run lint` to check for code style issues using ESLint.
- **Type-checking:** Run `npm run typecheck` to ensure TypeScript correctness.

## Build and Development
- **Local Development:**
    - `npm run start:dev`: Rebuilds on changes and connects to services (e.g., via dev environment).
    - `npm run start:dev-local`: Rebuilds on changes and connects to local Docker services.
- **Production Build:** `npm run build` uses esbuild to compile and bundle the application into the `dist/` directory.

## Configuration
The application uses environment variables for configuration, managed in `server/config.ts`.
Incident types are defined in `server/reportConfiguration/types/`. These are largely generated using scripts in the `scripts/` directory (e.g., `updateNomisIncidentTypeConfigurations.ts`).

## Coding Standards
- Follow the HMPPS Digital coding standards.
- Prefer TypeScript for all new code and maintenance.
- Ensure all new features are covered by unit and integration tests.
- Follow GOV.UK Design System and MoJ Frontend patterns for any UI changes.
- Use `hmpo-form-wizard` for complex multi-step forms.
