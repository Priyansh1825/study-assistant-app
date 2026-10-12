# ⚡ AI Study Assistant

A React-based interactive study tool that takes free-form notes and uses generative AI to instantly create a playable deck of flashcards. 

This project was built for the Frontend Internship Assignment. It securely routes AI requests through a lightweight Node.js backend to protect API keys and strictly enforces JSON schema parsing to prevent malformed AI responses from breaking the UI.

## 🚀 Setup & Usage

To meet the requirement of a simple startup process, I have configured a root-level script using `concurrently` to launch both the backend and frontend simultaneously.

1. **Clone the repository:**
   \`\`\`bash
   git clone <your-repo-url>
   cd study-assistant-app
   \`\`\`

2. **Set up your environment variables:**
   - Navigate to the `backend/` directory.
   - Copy the `.env.example` file and rename it to `.env`.
   - Add your Gemini API key: `GEMINI_API_KEY=your_actual_key_here`

3. **Install dependencies:**
   From the root folder, run:
   \`\`\`bash
   npm run install-all
   \`\`\`
   *(Alternatively, run `npm install` inside both the frontend and backend folders).*

4. **Start the application:**
   From the root folder, run:
   \`\`\`bash
   npm start
   \`\`\`
   - The frontend will run on `http://localhost:5173`
   - The backend server will run on `http://localhost:5000`

## 🤖 AI-Usage Note
To remain fully transparent, I used AI tools (Gemini/Claude) during this assignment to:
* Generate the boilerplate Express.js server setup and the initial Vite CSS layout.
* Brainstorm the safest way to enforce strict JSON schemas via the Google Generative AI SDK to ensure reliable data structures. 
* I manually hand-wrote the React state management (handling race conditions with `AbortController`), the loading/error states, and the `FlashcardQuiz` component's internal logic to ensure I fully understood and controlled the interactive UI lifecycle.

## ✨ Key Features
- **Instant AI Flashcards:** Generates structured flashcard decks using Gemini AI with strict JSON schema validation.
- **Local Persistence:** Active decks are automatically preserved in `localStorage`, persisting through page refreshes.
- **Interactive Quiz Modes:** Progress bar, round statistics, accuracy rate, and targeted re-testing of incorrect cards.
- **Keyboard Shortcuts:**
  - `Space` or `Enter`: Flip flashcard
  - `←` or `1`: Mark as needing review (incorrect)
  - `→` or `2`: Mark as mastered (correct)
  - `R`: Re-test wrong answers on completion screen
- **Pre-populated Study Ideas:** Clickable topic tags for instant testing.
- **Health & Diagnostics Endpoint:** `GET /api/health` validates backend status and API key presence.

## ⚠️ Known Limitations
* **Token Limits:** Large text inputs (multi-chapter textbook notes) may hit model token windows.
* **Math/LaTeX Rendering:** Text-only rendering; LaTeX mathematical formulas require an integrated math renderer (e.g. KaTeX). 

## ⏱️ Time Spent
* **Architecture & Backend Setup:** ~1.5 hours
* **React State & API Integration:** ~2 hours
* **Interactive Quiz Component & UI:** ~2 hours
* **Refining, Debugging & Documentation:** ~1 hour
* **Total Time:** ~6.5 hours