# ServiceGrid – Frontend

**ServiceGrid** is a modern Field Service & Maintenance Management SaaS platform designed to help service businesses manage their daily operations efficiently.

This repository contains the **React.js frontend application** for ServiceGrid.

## Tech Stack

- React.js
- Vite
- JavaScript
- Tailwind CSS
- React Router DOM
- Redux Toolkit
- Axios
- Lucide React
- React Hot Toast

## Features

- Login and authentication UI
- Dashboard layout
- Sidebar navigation
- Responsive application layout
- Customer management
- Equipment management
- Service request management
- Job management
- Technician management
- Inventory management
- Invoice management
- Reports
- Settings

_Note: Business modules are currently planned for future development._

## Project Structure

```text
src/
├── assets/
├── components/
│   ├── common/
│   └── layout/
├── features/
├── layouts/
├── routes/
├── services/
├── store/
├── hooks/
├── utils/
├── styles/
├── App.jsx
└── main.jsx
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Run Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Application Architecture

ServiceGrid follows a feature-based frontend architecture to keep modules organized, reusable, and maintainable.

The frontend is designed to integrate with the ServiceGrid backend API in future development.

## Development Status

<text>Frontend initialization and foundational application setup.</text>

Business module implementation and backend integration will be developed incrementally.

---

**Project:** ServiceGrid

**Application:** Web Frontend

**Framework:** React.js + Vite
