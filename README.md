# School Portal - React TypeScript Dashboard

A modern school management dashboard built with React, TypeScript, Vite, and Tailwind CSS.

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Linting**: ESLint

## 📁 Project Structure

```
src/
├── 📁 components/         # Reusable UI components
│   ├── 📁 layout/        # Layout components
│   │   ├── 📄 Navbar.tsx     # Top navigation bar
│   │   └── 📄 Sidebar.tsx    # Side navigation menu
│   └── 📁 ui/            # Generic UI components (Buttons, Inputs, etc.)
├── 📁 layouts/           # Page layout wrappers
│   └── 📄 DashboardLayout.tsx # Main dashboard layout with sidebar
├── 📁 pages/             # Page components
│   └── 📄 Dashboard.tsx      # Dashboard home page
├── 📁 routes/            # Routing configuration
│   └── 📄 AppRoutes.tsx      # React Router routes
├── 📁 styles/            # Global styles
│   └── 🎨 globals.css        # Tailwind CSS imports
├── 📁 api/               # API service functions
├── 📁 hooks/             # Custom React hooks
├── 📁 contexts/          # React Context providers
├── 📁 utils/             # Utility functions
├── 📁 types/             # TypeScript type definitions
├── 📁 constants/         # App constants and configuration
├── 📁 services/          # Business logic services
├── 📁 features/          # Feature-based modules
└── 📄 App.tsx            # Root application component
```

## 🎯 Features

- **Responsive Dashboard** with sidebar navigation
- **Modern UI** with Tailwind CSS styling
- **TypeScript** for type safety
- **Component-based architecture**
- **Mobile-friendly** responsive design

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📄 Pages & Routes

- `/dashboard` - Main dashboard with stats and quick actions
- `/attendance` - Student attendance management
- `/leave-request` - Leave request system
- `/e-library` - Digital library access
- `/profile` - User profile management

## 🎨 Styling

This project uses Tailwind CSS for styling with a clean, modern design system featuring:

- Responsive grid layouts
- Consistent color palette
- Smooth transitions and hover effects
- Mobile-first approach
