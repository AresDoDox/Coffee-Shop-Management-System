---
name: feature-creator
description: Create a full-stack feature for the Coffee Shop Management System. Use this skill whenever the user asks to add a new function/feature, module, API endpoint, or UI component to the project. This skill ensures that all necessary parts of a feature are created seamlessly, including documentation, backend/frontend coding, testing, Postman collection updates, workflows, and PlantUML/Mermaid diagrams.
---

# Feature Creator Skill

This skill helps you automatically scaffold and fully implement a new feature for the Coffee Shop Management System, ensuring that all standards and components are handled sequentially.

When a user asks to create a new feature or function, follow these exact steps:

## Step 1: Clarify and Document
1. Ask the user for specific details if the prompt is too brief (e.g., necessary db fields, core business logic, expected endpoints).
2. Create or update a documentation file in `documents/` (e.g., `documents/feature_name.md`).
   - Describe the business logic and user steps.
   - Include a **PlantUML** or **Mermaid** diagram (e.g., sequence diagram or flowchart) to visualize the feature's workflow. (Mermaid is preferred in markdown files).

## Step 2: Backend Coding
1. Navigate to `coffee-shop-backend/`.
2. Create or update the necessary models, controllers, routes, and services for the new feature.
3. Ensure the code adheres to the existing architecture. 
   - **Authentication/Authorization**: When securing new routes, always use `authenticateToken` middleware *before* `authorize`.
   - **ESLint & TypeScript**: Ensure strict type safety. Do not use `any` types. Provide explicit interfaces or use `unknown` for errors.

## Step 3: Frontend Coding
1. Navigate to `coffee-shop-frontend/`.
2. Create the necessary React components, pages, and API integration hooks/services to communicate with the backend.
   - **API Calls**: Do not create a raw `axios` instance for services. You MUST import the shared pre-configured API client (e.g., `import api from './api'`) to ensure auth/bearer tokens are attached.
3. Ensure UI matches the existing design system and Tailwind styling.
   - **No External UI Libraries**: Do NOT import or use libraries like `@mui/material`. Use the project's native Tailwind CSS and `lucide-react` for icons.
   - **Theme Variables**: Use the project's CSS variables (e.g., `text-textMain`, `bg-surface`, `bg-secondary`, `bg-primary`) to maintain consistency in light/dark mode, especially for admin charts and tables.
   - **React Hooks**: Avoid calling `setState` or async fetching sequentially inside empty `useEffect` arrays without wrapping or using an appropriate eslint disable comments if intentional, to prevent cascading renders.
   - **ESLint & TypeScript**: Strictly avoid `any` types. Make sure the code passes `tsc --noEmit` and `eslint`.

## Step 4: Testing
1. Write unit tests or integration tests for the backend logic (if applicable in the repository).
2. Write component tests for the frontend (if applicable).
3. Ensure that the new feature does not break existing functionality. Run relevant tests.

## Step 5: Postman Update
1. Open the existing Postman collection located at `coffee-shop-backend/postman_collection.json`.
2. Using the `multi_replace_file_content` block or appending to the JSON tree carefully, insert the new API endpoints into the collection with appropriate request body structures and authentication headers.
   - *Note: Please be very careful with JSON formatting when modifying this file. Validate JSON structure if needed.*

## Step 6: Workflow Update
1. If the new feature requires a specific background job, CI/CD update, or a custom agent workflow, create/update the relevant workflow `.md` files in `.agents/workflows/`.

## Step 7: Final Review
1. Provide a summary of all the files created and modified.
2. Outline specific instructions or commands for the user to test the new feature locally.
