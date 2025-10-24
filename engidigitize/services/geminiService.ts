import { GoogleGenAI, Type } from "@google/genai";
import type { ProcessedData } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    // This will be caught by the app's error boundary in a real scenario
    throw new Error("API_KEY environment variable is not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    structuredData: {
      type: Type.STRING,
      description: 'A JSON formatted string containing the structured data extracted from the drawing, such as title block information, bill of materials, and notes. Ensure all keys and string values are enclosed in double quotes.'
    },
    vectorDrawing: {
      type: Type.STRING,
      description: 'A string containing the complete, valid SVG code representing a vectorized version of the main drawing area. The SVG should be scalable and include a viewBox attribute.'
    }
  },
  required: ['structuredData', 'vectorDrawing']
};

export const processEngineeringDrawing = async (base64Image: string, mimeType: string): Promise<ProcessedData> => {
  const prompt = `
    You are an expert engineering assistant AI called "EngiDigitize". Your task is to analyze the provided engineering drawing.
    Perform two critical actions:
    1.  **Extract Data**: Meticulously extract all textual information from title blocks, bills of materials, component lists, specifications, and any notes. Structure this information as a clean, well-formed JSON object.
    2.  **Vectorize Drawing**: Convert the main schematic or drawing area into a clean, simplified, and accurate SVG format. The SVG must be valid and renderable.

    Return a single JSON object that conforms to the provided schema, with two keys:
    - "structuredData": A string containing the JSON data you extracted.
    - "vectorDrawing": A string containing the complete SVG code you generated.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { 
            parts: [
                { inlineData: { data: base64Image, mimeType: mimeType } },
                { text: prompt }
            ] 
        },
        config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
            temperature: 0.1, // Lower temperature for more deterministic output
        }
    });
    
    const jsonText = response.text.trim();
    // Gemini with JSON schema returns the object directly
    const parsedResponse = JSON.parse(jsonText);

    if (parsedResponse.structuredData && parsedResponse.vectorDrawing) {
        return {
            structuredData: parsedResponse.structuredData,
            vectorDrawing: parsedResponse.vectorDrawing
        };
    } else {
        throw new Error("AI response is missing required fields.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI model.");
  }
};
