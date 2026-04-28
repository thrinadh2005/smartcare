# SmartCare 🏥

SmartCare is a comprehensive health management application designed to help users track their medications, manage doctor appointments, and monitor medicine expiry dates. It features a modern, responsive UI and integrated voice summaries for accessibility.

## 🚀 Key Features

- **Personalized Dashboard**: A high-level overview of your daily health schedule.
- **Medicine Tracker**: Schedule dosages, set reminders, and mark medications as taken or pending.
- **Appointment Manager**: Keep track of upcoming doctor visits with reminder settings.
- **Expiry Tracker**: Monitor medicine shelf life. Includes support for label scanning and automated alerts.
- **Voice Summary**: Get an audio briefing of your daily schedule with a single click.
- **Security First**: Built with robust authentication (JWT), security headers (Helmet), and API rate limiting.
- **Print Support**: Generate physical copies of your health dashboard for doctors or personal records.
- **Fully Responsive**: Optimized for Mobile, Tablet, and Desktop views.

## 🛠️ Tech Stack

### Frontend
- **React.js**: Modern UI component architecture.
- **Tailwind CSS**: Utility-first styling for a custom, high-contrast theme.
- **Heroicons**: Clean and accessible SVG iconography.
- **React Router**: Seamless client-side navigation.

### Backend
- **Node.js & Express**: High-performance server environment.
- **MongoDB Atlas**: Scalable NoSQL cloud database.
- **Mongoose**: Elegant object modeling for Node.js.
- **JWT**: Secure token-based user authentication.
- **Helmet & Rate Limit**: Production-grade security middleware.

## 📁 Project Structure

```text
smartcare/
├── backend/            # Node.js Express Server
│   ├── models/         # Mongoose Schemas (User, Medicine, etc.)
│   ├── routes/         # API Endpoints
│   └── server.js       # Entry point & Security Middleware
├── frontend/           # React Application
│   ├── src/
│   │   ├── pages/      # Dashboard, Medicines, Appointments, etc.
│   │   ├── services/   # API Integration
│   │   └── index.css   # Tailwind & Global Styles
│   └── tailwind.config.js
├── render.yaml         # Blueprint for Render Deployment
└── DEPLOYMENT.md       # Detailed Deployment Guide
```

## ⚙️ Local Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/thrinadh2005/smartcare.git
    cd smartcare
    ```

2.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    # Create a .env file based on .env.example
    npm start
    ```

3.  **Frontend Setup**:
    ```bash
    cd ../frontend
    npm install
    npm start
    ```

The app will be available at `http://localhost:3000`.

## 🌐 Deployment

This project is optimized for **Render**. Use the provided `render.yaml` for a "One-Click" deployment. See [DEPLOYMENT.md](DEPLOYMENT.md) for a complete step-by-step walkthrough.

## 🛡️ Security Note

Never share your `.env` file or commit it to version control. The repository is pre-configured with a `.gitignore` that protects sensitive credentials.

---
Built with ❤️ for better health management.
