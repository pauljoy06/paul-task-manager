# Task Management App

## Overview

This project is a task management application designed to showcase different use cases around task organization and management. Inspired by Notion, Asana, and Linear, the app provides essential CRUD functionality along with filtering and sorting to enhance user experience.

I built this using **Vite and React**, as it offered the fastest way to get started with a modern, optimized development setup.

## Assumptions & Design Decisions

- **State Management:** Used React's built-in state (`useState` & `useReducer`). Given the project scope, React’s default state management felt sufficient.
- **Scalability Considerations:** The table and core components were built with the assumption that additional views and pages might be required in the future.
- **No Pagination:** The task list loads in full, as pagination wasn't prioritized.
- **No Data Table Libraries:** Sorting, filtering, and all UI interactions were implemented manually to align with the project requirements.
- **Accessibility & Design:** Given time constraints, accessibility and design refinements took a backseat in favor of functionality.

## Interesting Things to Know

- **Custom-Built Components:** All inputs, tables, and state management logic were built from the ground up—no external data table libraries.

## Future Enhancements (If More Time)

-  **Better Design** – Improve UI aesthetics with more refined styling and layout adjustments.
-  **Filters** – Add custom filters
-  **Toast Messages** – Add user feedback messages for actions like task creation, updates, and deletions.
-  **Smooth Animations** – Improve UX with better transitions and micro-interactions.


## Running the Project

1. Clone the repository:
   ```sh
   git clone https://github.com/pauljoy06/paul-task-manager.git
   ```

2. Install dependencies
    ```sh
    npm install
   ```

3. Start development server
    ```sh
    npm run dev
   ```

4. Open browser -> Visit (http://localhost:5173)
