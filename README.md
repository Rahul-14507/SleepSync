# 🌙 SleepSync

A premium sleep tracking web application that helps users visualize their sleep patterns for better rest and wellness.

![SleepSync](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2-646cff?style=for-the-badge&logo=vite)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4-ff6384?style=for-the-badge&logo=chartdotjs)

## ✨ Features

- **Sleep Logging**: Track daily sleep and wake times with automatic midnight-crossing calculations
- **Visual Analytics**: Beautiful gradient bar charts showing sleep duration trends
- **Statistics Dashboard**: Real-time insights into average sleep, consistency, and patterns
- **Data Persistence**: Local storage ensures your data is saved across sessions
- **Premium UI/UX**: Glassmorphism effects, smooth animations, and gradient accents
- **Responsive Design**: Optimized for all screen sizes

## 🎨 Design Highlights

- **Glassmorphism**: Frosted glass cards with backdrop blur
- **Gradient Accents**: Purple-to-indigo gradients throughout
- **Micro-animations**: Smooth fade-in, slide-up, and hover effects
- **Dark Theme**: Deep night theme optimized for evening use
- **Empty States**: Beautiful illustrated placeholders

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Rahul-14507/SleepSync.git

# Navigate to project directory
cd SleepSync

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app in action.

### Build for Production

```bash
npm run build
```

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Vanilla CSS with custom design system
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Storage**: localStorage API

## 📦 Project Structure

```
SleepSync/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # Main dashboard view
│   │   ├── Layout.jsx          # App layout wrapper
│   │   ├── SleepChart.jsx      # Chart visualization
│   │   ├── SleepForm.jsx       # Sleep entry form
│   │   └── StatsCard.jsx       # Reusable stat card
│   ├── context/
│   │   └── SleepContext.jsx    # Global state management
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── public/
└── package.json
```

## 🌐 Deployment

This app is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy with default settings

No environment variables or database setup required!

## 📝 License

MIT License - feel free to use this project for learning or personal use.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

**Built with ❤️ for better sleep**
