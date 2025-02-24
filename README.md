# Task Management App

## Overview

This project is a task management application designed to showcase different use cases around task organization and management. Inspired by Notion, Asana, and Linear, the app provides essential CRUD functionality along with filtering and sorting to enhance user experience.

I built this using **Vite and React**, as it offered the fastest way to get started with a modern, optimized development setup.

## Assumptions & Design Decisions

Given the limited time (**constraints due to my own office work and health**) for this project, I decided to lean into my strengths and focus on the **core functionality** rather than perfecting the design. Most of my effort went into **building the table, data hooks, and components from scratch** to ensure flexibility and scalability. While the UI could be more polished, the foundation is strong and structured in a way that makes future enhancements seamless.

- **Prioritized Functionality Over Design** – With time constraints, I focused on structuring data, managing state, and ensuring smooth interactions rather than refining UI details.
- **Custom-Built Components** – The table, state management, and UI interactions were built from the ground up, without relying on external data table libraries.
- **No Pagination Yet** – Right now, all tasks load at once. If the dataset grows, pagination would be a good next step.
- **React State Management** – Stuck to `useState` and `useReducer` as they were sufficient for handling the app’s needs.
- **Future-Proofing** – While this version has a single view, the structure allows for easy expansion with additional pages or layouts down the road.
- **Minimal Accessibility Considerations** – Given the time constraints, I had to put accessibility and detailed UI refinements on the back burner.


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
