# chEElax - Smart Air Conditioning Control

A modern, responsive web application for smart air conditioning control built with React, Vite, and TailwindCSS.

## 🎯 Features

- **Dashboard**: Large circular temperature display with intuitive controls
- **Schedule Management**: Create and manage automated temperature schedules
- **History Tracking**: View temperature logs and usage patterns
- **Settings**: Customize system preferences and energy-saving options
- **About Page**: Learn about the team and company information

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   # If you have the project files, navigate to the project directory
   cd cheelax-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
cheelax-ui/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── NavBar.jsx     # Navigation component
│   │   ├── TemperatureCard.jsx  # Main temperature control
│   │   ├── ScheduleForm.jsx     # Schedule creation form
│   │   ├── HistoryList.jsx      # Temperature history display
│   │   └── ToggleSwitch.jsx     # Custom toggle component
│   ├── pages/             # Page components
│   │   ├── Home.jsx       # Dashboard page
│   │   ├── Schedule.jsx   # Schedule management
│   │   ├── History.jsx    # History page
│   │   ├── Settings.jsx   # Settings page
│   │   └── About.jsx      # About page
│   ├── App.jsx            # Main app component with routing
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles and Tailwind imports
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # TailwindCSS configuration
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

## 🎨 Design Features

- **Modern UI**: Clean, minimal design with rounded cards and subtle shadows
- **Responsive**: Works seamlessly on desktop and mobile devices
- **Color Palette**: Cool blues and grays for a professional look
- **Typography**: Poppins and Inter fonts with wide letter spacing
- **Interactive Elements**: Smooth transitions and hover effects

## 🔧 Technology Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **PostCSS** - CSS processing

## 📱 Pages Overview

### Home Dashboard
- Large circular temperature display
- Power on/off controls
- Mode selection (Cool, Heat, Auto)
- Temperature adjustment buttons
- Quick action buttons

### Schedule
- Time picker for start/end times
- Comfort level slider (16°C - 30°C)
- Day selection for recurring schedules
- Active schedules display
- Schedule tips and recommendations

### History
- Filterable temperature logs
- Session duration tracking
- Status indicators (Active, Completed)
- Export options (CSV, PDF)
- Usage statistics

### Settings
- Display preferences (Dark mode, Temperature units)
- Energy saving options
- Notification settings
- Language selection
- System information

### About
- Company mission and values
- Key features overview
- Team member profiles
- Company statistics
- Contact information

## 🎯 Key Components

### TemperatureCard
Interactive circular temperature display with:
- Large temperature reading
- Power toggle button
- Temperature adjustment controls
- Mode selection buttons
- Visual status indicators

### ScheduleForm
Comprehensive scheduling interface with:
- Time input fields
- Comfort level slider
- Day-of-week selection
- Enable/disable toggle
- Form validation

### HistoryList
Data visualization component with:
- Filterable history entries
- Status badges
- Duration tracking
- Summary statistics
- Export functionality

## 🚀 Deployment

To build for production:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

This is a demo project showcasing modern React development practices. Feel free to use it as a starting point for your own smart home applications.

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ for smart home enthusiasts**
