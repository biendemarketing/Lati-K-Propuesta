import { GoogleGenAI } from '@google/genai';

/**
 * Centralized Google AI client.
 * This instance is initialized once with the API key from environment variables
 * and should be imported and used throughout the application for any interactions
 * with the Gemini API.
 */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export { ai };
