# 🚀 DevDeck

A modern developer dashboard built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

DevDeck is a learning project focused on mastering the Next.js App Router, reusable component architecture, responsive design, and API integration by building a clean, production-inspired dashboard.

---

## ✨ Features

- 🌙 Light/Dark Theme Toggle
- 📱 Fully Responsive Layout
- 📂 Sidebar Navigation
- 🍔 Mobile Drawer Navigation
- 👤 GitHub Profile Viewer
- ⚡ Loading & Error States
- 🚫 Custom 404 Page
- 🎨 Modern UI with shadcn/ui
- 🧩 Reusable Components
- 📦 Organized Project Structure

---

## 🛠️ Tech Stack

### Frontend
- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

### APIs
- GitHub REST API

---

## 📂 Project Structure

```text
app/
├── dashboard/
├── github/
├── settings/
├── loading.tsx
├── error.tsx
├── not-found.tsx
└── layout.tsx

components/
├── layout/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── MobileSidebar.tsx
│
├── providers/
│   └── ThemeProvider.tsx
│
└── ui/
    ├── Card.tsx
    ├── Spinner.tsx
    ├── SearchBar.tsx
    ├── ProfileCard.tsx
    ├── ThemeToggle.tsx
    └── button.tsx

services/
└── github.service.ts

types/
└── github.ts

constants/
```

---

## 📸 Screenshots

> Add screenshots here after deployment.

| Home | Dashboard | GitHub Viewer |
|------|-----------|---------------|
| Screenshot | Screenshot | Screenshot |

---

## 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/your-username/devdeck.git
```

Move into the project

```bash
cd devdeck
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

## 📖 What I Learned

This project helped me understand:

- Next.js App Router
- File-based Routing
- Layouts
- Client vs Server Components
- React State Management
- TypeScript Interfaces
- API Fetching
- Error Handling
- Loading UI
- Responsive Design
- Theme Management
- Component Reusability
- Clean Folder Structure

---

## 🔮 Future Improvements

- Authentication
- Dashboard Widgets
- Charts & Analytics
- GitHub Repository Explorer
- Recent Activity Feed
- Search History
- Profile Favorites

---

## 👨‍💻 Author

**Ashutosh Tanguria**