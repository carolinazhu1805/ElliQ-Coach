# ElliQ Sudoku Coach

This project contains an AI-powered Sudoku coaching interface designed to simulate deployment on ElliQ's tablet screen. Built as a prototype to demonstrate personalisation and conversational coaching for older adults.

## Live Demo

Try it out at: https://elliq-coach.vercel.app/

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Settings UI: A vs B

The settings panel has two layout variants, controlled by a single constant at the top of `src/App.jsx`:

```js
const SETTINGS_UI = "A"; // change to "B" for full-screen settings
```

- **Option A** — settings slide in as a side drawer over the game board, keeping the puzzle visible in the background
- **Option B** — settings open as a separate full-screen page

## Credits

- [React 19](https://react.dev/) — UI framework
- [Vite](https://vite.dev/) — build tool and dev server
- [Groq API](https://groq.com/) — powers the ElliQ coach using the `llama-3.1-8b-instant` model
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) — browser-native voice input and text-to-speech 
