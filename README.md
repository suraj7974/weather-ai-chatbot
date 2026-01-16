# AI Weather & Travel Assistant

A comprehensive, full-stack conversational agent designed to assist travelers with real-time weather forecasts, and location-based insights. This project leverages advanced LLMs (Large Language Models) and voice technologies to create a seamless, hands-free user experience.

---

## Key Features & How to Use Them

### 1. Context-Aware AI Chat
The core of the application is a smart chatbot powered by the **Groq API (Llama 3.3)**. It understands natural language and maintains conversation context.
*   **How to use:** simply type a query like *"Can i go for a quick stroll?"* or *"What should I pack for my visit to Tokyo"*. The AI acts as a travel agent, suggesting landmarks, and packing lists based on the destination.

### 2. Real-Time Weather Integration
The bot doesn't just talk; it visualizes data. When you mention a location, the system automatically fetches live weather data.
*   **How to use:** Ask *"What is the weather like in Paris?"*. Alongside the chat response, a dedicated **Weather Card** will appear, displaying temperature, humidity, wind speed, and a visual forecast, powered by the **OpenWeatherMap API**.

### 3. Voice Interaction (Hands-Free Mode)
Designed for accessibility and on-the-go usage, the app supports full bidirectional voice communication.
*   **How to use:**
    *   **Speak:** Click the **Microphone Icon** and speak your request. The app uses the **Web Speech API** to convert your voice to text.
    *   **Listen:** The AI's response is automatically read aloud (Text-to-Speech), allowing for a completely screen-free interaction loop if desired.

### 4. Smart Geolocation
The app can tailor responses to your current location.
*   **How to use:** Click the **Target/Location Icon** to grant browser location permissions. The app will reverse-geocode your coordinates to find your current city and provide hyper-local weather updates or travel advice.

---

## Technical Architecture

This project is built as a **Monorepo** using modern web standards.

### **Frontend (Client)**
*   **Framework:** [React 19](https://react.dev/) with [Vite](https://vitejs.dev/) for lightning-fast builds.
*   **Language:** TypeScript (Strict typing for robustness).
*   **Styling:** [TailwindCSS](https://tailwindcss.com/) for responsive design and [Framer Motion](https://www.framer.com/motion/) for fluid UI transitions.
*   **State Management:** React Context API (Chat, Theme, Session management).
*   **Voice:** Custom hooks (`useVoiceRecognition`, `useTextToSpeech`) wrapping native browser APIs.

### **Backend (Server)**
*   **Runtime:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/).
*   **Architecture:** Controller-Service pattern.
    *   **Controllers:** Handle HTTP requests and input validation.
    *   **Services:** encapsulate business logic and external API calls (`GroqService`, `WeatherService`).
*   **AI Engine:** [Groq](https://console.groq.com/playground) utilizing the `llama-3.3-70b-versatile` model for high-speed inference.
*   **External Data:** OpenWeatherMap API for forecast and geocoding data.

---

## Installation & Setup

### Prerequisites
*   **Node.js** (v20+ recommended)
*   **pnpm** (Package manager)
*   **API Keys:**
    *   [Groq API Key](https://console.groq.com/)
    *   [OpenWeatherMap API Key](https://openweathermap.org/api)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd weather-travel-chatbot
```

### 2. Install Dependencies
This project uses a workspace setup. Install dependencies for both client and server from the root:
```bash
pnpm install
```

### 3. Configure Environment Variables
You need to set up the `.env` files for both the server and client.

**Server (`server/.env`):**
Create a `.env` file in the `server` directory:
```env
PORT=3001
NODE_ENV=development
GROQ_API_KEY=...                  # Your Groq API Key
OPENWEATHER_API_KEY=...           # Your OpenWeatherMap Key
CLIENT_URL=http://localhost:5173  # Frontend URL for CORS
```

**Client (`client/.env`):**
Create a `.env` file in the `client` directory (or use the default):
```env
VITE_API_URL=/api                 # Proxy path to backend
```

### 4. Run the Application
Start both the client and server concurrently in development mode:
```bash
pnpm dev
```
*   **Frontend:** `http://localhost:5173`
*   **Backend:** `http://localhost:3001`

---

## Project Structure

```
weather-travel-chatbot/
├── client/                     # React Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Images and global static files
│   │   ├── components/         # Reusable UI components
│   │   │   ├── chat/           # Chat interface components
│   │   │   ├── layout/         # App layout components
│   │   │   ├── location/       # Location search and display
│   │   │   ├── sidebar/        # Sidebar navigation
│   │   │   ├── voice/          # Voice interaction controls
│   │   │   └── weather/        # Weather visualization cards
│   │   ├── context/            # Global State (Chat, Theme, Session)
│   │   ├── hooks/              # Custom Hooks (Voice, API, TTS)
│   │   ├── services/           # Frontend API calls
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # Helper functions (Date, Storage)
│   ├── index.html              # HTML entry point
│   └── vite.config.ts          # Vite bundler config
│
├── server/                     # Express Backend
│   ├── src/
│   │   ├── config/             # Environment configuration
│   │   ├── controllers/        # Request Handlers
│   │   ├── middleware/         # Error handling and interceptors
│   │   ├── routes/             # API Endpoints
│   │   ├── services/           # Business Logic (Groq AI, Weather)
│   │   ├── types/              # Backend Type definitions
│   │   └── utils/              # Helpers and AI System Prompts
│   └── tsconfig.json           # TypeScript config
└── package.json                # Workspace scripts
```
