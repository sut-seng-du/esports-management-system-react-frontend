# Esports Management System - React Frontend

[![Platform: Web](https://img.shields.io/badge/Platform-Web-3178C6?style=flat-square)](https://reactjs.org/)
[![React Version](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Project Version](https://img.shields.io/badge/Version-0.1.0-4CAF50?style=flat-square)](https://github.com/sut-seng-du/esports-management-system-react-frontend)
[![Live Demo](https://img.shields.io/badge/Live-Demo-FF5722?style=flat-square&logo=browser&logoColor=white)](https://esports-client.sutsengdu.com)

A modern, high-performance web dashboard for managing esports facilities, built with React and Vite. This frontend provides a premium user interface for tracking bookings, inventory, pricing, and member details with a focus on visual excellence and smooth user experience.

## Features

- **Dynamic Dashboard:** Real-time overview of facility operations.
- **Advanced Booking System:** Manage and track seat bookings with ease.
- **Inventory Management:** Track drinks, snacks, and equipment stock.
- **Announcements Engine:** Schedule and display posters for events and updates.
- **Member Insights:** Track top members and debtors with detailed reports.
- **Premium UI/UX:** Dark mode support, smooth micro-animations (Framer Motion), and responsive layouts.
- **Interactive Components:** Dynamic sliders (Swiper), sidebars, and custom icons (Lucide React).
- **Comprehensive Testing:** 100% test coverage with 34+ core frontend tests and 70+ backend tests.

## Live Demo

Experience the live application here: **[esports-client.sutsengdu.com](https://esports-client.sutsengdu.com)**

## Example Screenshots

### Home Dashboard
![Home Dashboard](/public/screenshots/home-page.png)

### Real-time Seat Status
![Real-time Seat Status](/public/screenshots/seats-grid.png)

### Advanced Booking System
![Advanced Booking System](/public/screenshots/bookings-modal.png)

### Member Leaderboard
![Member Leaderboard](/public/screenshots/top-members.png)

### Account Settings & Theme
![Account Settings & Theme](/public/screenshots/settings.png)

## Tech Stack

- **Framework:** [React 18](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** CSS3 (Custom Design System)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Hooks (useState, useEffect)
- **Networking:** [Axios](https://axios-http.com/)
- **Testing:** [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Backend Repository

The backend for this application is built with Laravel and can be found here:
[Esports Management System - Laravel Backend](https://github.com/sut-seng-du/esports-management-system-laravel-backend)

## Requirements

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Backend Server](https://github.com/sut-seng-du/esports-management-system-laravel-backend) (built with Laravel, running on XAMPP or similar)

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sut-seng-du/esports-management-system-react-frontend.git
   cd esports-management-system-react-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your backend API URL:
   ```env
   VITE_API_BASE_URL=http://localhost/your-backend-api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the production-ready application in the `dist/` folder.
- `npm run preview`: Previews the local production build.
- `npm run test`: Runs the Jest test suite.

## Testing

The project uses Jest and React Testing Library for unit and integration testing.
```bash
npm run test
```

## Project Structure

```text
src/
├── assets/         # Images, fonts, and static assets
├── components/     # Reusable UI components (Nav, etc.)
├── pages/          # Full page components (Home, Bookings, Inventory, etc.)
├── api.js          # API configuration and axios instance
├── App.jsx         # Root component and routing logic
├── App.css         # Global component styles
└── index.css       # Core design system and global styles
```

## License

This project is private and for internal use.
