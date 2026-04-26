# Benefit Builder Pro 🚀

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://ais-pre-d7yb2ykuen34ldpaqoh247-684095037392.asia-southeast1.run.app)

Benefit Builder Pro is a high-performance, command-center-themed web application designed for strategic simulation and live gaming events. It allows administrators to host competitive sessions where players or teams design optimized employee benefit packages while balancing budgetary constraints against employee happiness (HP).

## 🛠 Features

- **Admin Command Center**: Real-time control over live sessions, global benefit library, and capital allocation.
- **Session History & Archiving**: Dedicated history tab to review past leaderboards and outcomes without cluttering active operations.
- **Real-time Leaderboard**: Instant telemetry updates as teams submit their packages, ranked by total HP score.
- **Cyberpunk UI/UX**: Sophisticated terminal-style aesthetic built with Tailwind CSS and Framer Motion.
- **Live Sync**: Powered by Firebase Firestore for millisecond-latency data synchronization across all clients.
- **Automatic Mission Control**: Real-time timer synchronization that auto-locks player packages when time expires.
- **Robust Validation**: Ensuring data integrity with mandatory team identification and asset selection requirements.

## 🕹 How It Works

Benefit Builder Pro is designed for interactive workshop or group event scenarios.

### For Administrators
1. **Authorize**: Sign in via Google to access the encrypted Admin Command Center.
2. **Asset Library**: Define the "Global Asset Library" (benefits), assigning each a BU (Budget Units) cost and a target HP (Happiness) factor.
3. **Initialize Session**: Launch a "Live Event" by configuring session parameters: name, maximum budget, and an operational timer.
4. **Deploy Link**: Share the system-generated **Invite Link** with players.
5. **Monitor & Archive**: Track the **Live Session Leaderboard**. Once a session is complete, mark it as "Finished" to move it to **Session History** for permanent record-keeping.

### For Players
1. **Connect**: Join the session via the provided Invite Link.
2. **Register**: Provide your **Team Identification**.
3. **Construct**: Browse the Asset Inventory. Strategically allocate your budget to maximize Total HP.
4. **Lock In**: Manually lock in your package before the timer ends, or the system will automatically transmit your latest configuration at T-Zero.
5. **Validation**: The system strictly enforces budget adherence and requires at least one asset to be selected for a valid submission.

## 🔋 Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database/Auth**: Firebase (Firestore & Google Auth)
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Firebase Project

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd benefit-builder-pro
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📜 Firestore Rules

Ensure you deploy the security rules provided in `firestore.rules` to protect your data. Admin access is restricted to authorized users defined in the `admins` collection.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---
*Built with ❤️ using Google AI Studio Build*
