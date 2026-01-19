# Coffee Shop Management System - Frontend

This is the frontend application for the Coffee Shop Management System, built with **React**, **Vite**, **TypeScript**, and **TailwindCSS**.

## 🚀 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

## 🛠️ Installation

1. Clone the repository (if you haven't already):

   ```bash
   git clone <repository_url>
   cd coffee-shop-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## ⚙️ Environment Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

   _(On Windows Command Prompt, use `copy .env.example .env`)_

2. Open `.env` and verify the API configuration:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_API_VERSION=v1
   ```

## 📜 Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run lint`

Runs ESLint to check for code quality issues.

### `npm run preview`

Locally preview the production build.

## 📂 Project Structure

```
src/
├── components/   # Reusable UI components
├── layouts/      # Layout components
├── pages/        # Application pages/screens
├── services/     # API services and utilities
├── store/        # Redux store configuration
├── App.tsx       # Main application component & routing
└── main.tsx      # Entry point
```

## 🎨 Tech Stack

- **Framework**: [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
