import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export async function POST(req: Request) {
  try {
    const { prompt: userPrompt, category } = await req.json();

    const prompt = `You are an AI Design Consultant for a university campus.
    Task: Create a detailed visual design concept for a ${category || "poster"}.
    User Input: "${userPrompt}"
    
    Provide:
    1. A detailed visual description for an AI image generator (like Midjourney or DALL-E).
    2. Color Palette suggestions (with hex codes).
    3. Typography suggestions (Heading and Body).
    4. Layout advice.
    
    Return ONLY a JSON object with this structure:
    {
      "imagePrompt": "string",
      "colors": [ { "name": "string", "hex": "string" } ],
      "typography": { "heading": "string", "body": "string" },
      "layout": "string"
    }`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      let parsedResult;
      
      try {
        parsedResult = JSON.parse(cleanJson);
      } catch (e) {
        // Fallback if JSON parsing fails
        console.error("JSON parsing failed, attempting to extract JSON block");
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not parse AI response as JSON");
        }
      }

      // Ensure required structure exists
      const fallback = {
        imagePrompt: userPrompt,
        colors: [{ name: "Primary", hex: "#3b82f6" }, { name: "Neutral", hex: "#f3f4f6" }],
        typography: { heading: "Inter", body: "Inter" },
        layout: "Balanced grid layout with focus on readability."
      };

      const finalResult = {
        imagePrompt: parsedResult.imagePrompt || fallback.imagePrompt,
        colors: Array.isArray(parsedResult.colors) ? parsedResult.colors : fallback.colors,
        typography: {
          heading: parsedResult.typography?.heading || fallback.typography.heading,
          body: parsedResult.typography?.body || fallback.typography.body
        },
        layout: parsedResult.layout || fallback.layout
      };

      return NextResponse.json(finalResult);
  } catch (error: any) {
    console.error("Asset API error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate design" }, { status: 500 });
  }
}
