import { GoogleGenAI, Type } from "@google/genai";
import { AuditReport } from '../types';

let ai: GoogleGenAI | null = null;

const getClient = () => {
  if (ai) return ai;
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai;
};

export const generateAuditReport = async (text: string): Promise<AuditReport | null> => {
  try {
    const client = getClient();
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      You are an expert Business Intelligence Bot. 
      Your task is to analyze the following unstructured/messy text copied directly from a Google Maps page.
      
      Instructions:
      1. Ignore all junk text (UI labels, button text, ads, unrelated navigation).
      2. Extract: Business Name, Rating, and Hours.
      3. Analyze the reviews embedded in the text to identify sentiment and specific complaints.
      4. Generate a professional Arabic Audit Report.

      The JSON output must strictly follow this structure:
      {
        "businessName": "Name of the business",
        "rating": "Rating (e.g., 4.5)",
        "hours": "Operating hours summary",
        "performanceScore": 85, // A number 1-100 based on review sentiment
        "criticalProblems": ["Problem 1 in Arabic", "Problem 2 in Arabic"],
        "solutions": ["Solution 1 in Arabic", "Solution 2 in Arabic"],
        "sampleReply": "A polite, professional reply in Arabic to the most critical negative review found."
      }

      Input Text:
      """
      ${text}
      """
    `;

    const response = await client.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessName: { type: Type.STRING },
            rating: { type: Type.STRING },
            hours: { type: Type.STRING },
            performanceScore: { type: Type.NUMBER },
            criticalProblems: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            solutions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            sampleReply: { type: Type.STRING }
          },
          required: ["businessName", "rating", "performanceScore", "criticalProblems", "solutions", "sampleReply"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AuditReport;
    }
    return null;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};