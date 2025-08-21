import { GoogleGenAI } from '@google/genai';

/**
 * Centralized Google AI client.
 * This instance is initialized once with the API key from environment variables
 * and should be imported and used throughout the application for any interactions
 * with the Gemini API.
 */

let aiInstance: GoogleGenAI | null = null;
let initializationError: string | null = null;

// This initialization is wrapped in a try-catch block. The original code would crash the
// entire application if the API_KEY environment variable was not available on the client-side,
// resulting in a blank page. This is a common issue on platforms like Vercel where server-side
// environment variables are not exposed to the browser by default.
// By catching the error, we allow the application to load and run, while gracefully
// disabling AI-powered features and providing feedback to the user (admin).
try {
  aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (e) {
  initializationError = e instanceof Error ? e.message : 'Unknown error initializing AI client.';
  console.error("Google AI Client Initialization Error:", initializationError);
  console.warn("AI-powered features will be disabled. Ensure the API_KEY environment variable is correctly configured and exposed to the client-side build.");
}

export const ai = aiInstance;
export const aiInitializationError = initializationError;
