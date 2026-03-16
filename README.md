# Esports Management System - React Frontend

A modern, high-performance web dashboard for managing esports facilities, built with React and Vite. This frontend provides a premium user interface for tracking bookings, inventory, pricing, and member details with a focus on visual excellence and smooth user experience.

## ✨ Features

- **Dynamic Dashboard:** Real-time overview of facility operations.
- **Advanced Booking System:** Manage and track seat bookings with ease.
- **Inventory Management:** Track drinks, snacks, and equipment stock.
- **Announcements Engine:** Schedule and display posters for events and updates.
- **Member Insights:** Track top members and debtors with detailed reports.
- **Premium UI/UX:** Dark mode support, smooth micro-animations (Framer Motion), and responsive layouts.
- **Interactive Components:** Dynamic sliders (Swiper), sidebars, and custom icons (Lucide React).

## 🛠️ Tech Stack

- **Framework:** [React 18](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** CSS3 (Custom Design System)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Hooks (useState, useEffect)
- **Networking:** [Axios](https://axios-http.com/)
- **Testing:** [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 📋 Requirements

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A local backend server (running on XAMPP or similar as per configuration)

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/esports-management-system-react-frontend.git
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

## 💻 Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the production-ready application in the `dist/` folder.
- `npm run preview`: Previews the local production build.
- `npm run test`: Runs the Jest test suite.

## 🧪 Testing

The project uses Jest and React Testing Library for unit and integration testing.
```bash
npm run test
```

## 📁 Project Structure

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

## 📄 License

This project is private and for internal use.
