# SmartCare 🏥

SmartCare is a comprehensive health management application designed to help users track their medications, manage doctor appointments, and monitor medicine shelf life. It features a modern, responsive UI, integrated voice summaries, and automated email notifications.

## 🚀 Key Features

- **Personalized Dashboard**: A high-level overview of your daily health schedule.
- **Medicine Tracker**: Schedule dosages, set reminders, and mark medications as taken or pending.
- **Appointment Manager**: Keep track of upcoming doctor visits with automated email reminders.
- **Expiry Tracker**: Monitor medicine shelf life with automated email alerts for expiring products.
- **User Profile**: Manage your account details and change your password securely.
- **Email Notifications**: Real-time alerts for medicine doses, expiry dates, and appointments via Nodemailer.
- **PWA Support**: Installable on mobile devices with offline support and improved performance.
- **Voice Summary**: Get an audio briefing of your daily schedule with a single click.
- **Security First**: Built with robust authentication (JWT), input validation (express-validator), security headers (Helmet), and API rate limiting.
- **Print Support**: Generate physical copies of your health dashboard for doctors or personal records.
- **Fully Responsive**: Optimized for Mobile, Tablet, and Desktop views.

## 🛠️ Tech Stack

### Frontend
- **React.js**: Modern UI component architecture.
- **Tailwind CSS**: Utility-first styling for a custom, high-contrast theme.
- **Heroicons**: Clean and accessible SVG iconography.
- **React Router**: Seamless client-side navigation.
- **Workbox**: PWA support and service worker management.

### Backend
- **Node.js & Express**: High-performance server environment.
- **MongoDB Atlas**: Scalable NoSQL cloud database.
- **Mongoose**: Elegant object modeling for Node.js.
- **JWT**: Secure token-based user authentication.
- **Nodemailer**: Automated email notification system.
- **Helmet & Rate Limit**: Production-grade security middleware.
- **Express Validator**: Robust input validation and sanitization.

## 📁 Project Structure

```text
smartcare/
├── backend/            # Node.js Express Server
│   ├── controllers/    # Request handling logic
│   ├── middleware/     # Auth and validation middleware
│   ├── models/         # Mongoose Schemas (User, Medicine, etc.)
│   ├── routes/         # API Endpoints
│   ├── utils/          # Email service and utilities
│   └── server.js       # Entry point & Security Middleware
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Dashboard, Medicines, Appointments, etc.
│   │   ├── services/   # API Integration
│   │   └── index.css   # Tailwind & Global Styles
│   └── tailwind.config.js
└── .env.example        # Template for environment variables
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
    # Add your MONGODB_URI, JWT_SECRET, and EMAIL credentials
    npm start
    ```

3.  **Frontend Setup**:
    ```bash
    cd ../frontend
    npm install
    npm start
    ```

The app will be available at `http://localhost:3000`.

## 🛡️ Security Note

Never share your `.env` file or commit it to version control. The repository is pre-configured with a `.gitignore` that protects sensitive credentials.

---
Built with ❤️ for better health management.
