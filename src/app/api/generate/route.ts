import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

export async function POST(req: NextRequest) {
  try {
    const { eventName, theme, targetAudience, mode = "event" } = await req.json();

    // Basic validation
    if (!eventName || !theme || !targetAudience) {
      return NextResponse.json(
        { error: "Name, Theme/Topic, and Target Audience are required." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    let modeSpecificPrompt = "";

    if (mode === "event") {
      modeSpecificPrompt = `
      1. **Permission Email**: A formal 3-paragraph outreach to a Dean or College Head.
      2. **Instagram Caption**: Engaging social content with exactly 5 emojis and 5 hashtags.
      3. **Image Prompt**: A visual descriptor for a promotional poster (no text).
      4. **Code Snippet**: A simple HTML/CSS countdown or registration button component for the event page.
      5. **Outline**: A brief 5-point schedule for the event day.
      6. **Roadmap**: A 4-week preparation plan (Week 1, 2, 3, 4) with 2 tasks each.`;
    } else if (mode === "academic") {
      modeSpecificPrompt = `
      1. **Permission Email**: A formal request to a professor for collaboration or resource access.
      2. **Instagram Caption**: An educational teaser for the topic with 5 emojis and 5 hashtags.
      3. **Image Prompt**: A conceptual scientific or academic visual for a presentation (no text).
      4. **Code Snippet**: A simple Python or LaTeX snippet relevant to the academic topic.
      5. **Outline**: A 5-point syllabus or study plan for this topic.
      6. **Roadmap**: A 4-week study or research plan (Week 1, 2, 3, 4) with 2 milestones each.`;
    } else if (mode === "tech") {
      modeSpecificPrompt = `
      1. **Permission Email**: A formal proposal to the IT department for tool deployment.
      2. **Instagram Caption**: A tech-heavy announcement for a new project with 5 emojis and 5 hashtags.
      3. **Image Prompt**: A futuristic, high-tech abstract visual (no text).
      4. **Code Snippet**: A React/Next.js UI component or a Node.js utility function for the project.
      5. **Outline**: A brief technical roadmap (5 steps) for development.
      6. **Roadmap**: A 4-week development sprint plan (Week 1, 2, 3, 4) with 2 features/tasks each.`;
    }

    const systemPrompt = `You are a professional campus creative assistant. Your task is to generate multimodal content for a student project based on the input:
    Title/Name: ${eventName}
    Theme/Vision: ${theme}
    Target Audience: ${targetAudience}
    Mode: ${mode}

    ### CONTENT TO GENERATE:
    ${modeSpecificPrompt}

    ### OUTPUT FORMAT:
    You MUST respond with a valid JSON object ONLY.
    The JSON keys must be:
    - "permissionEmail": String
    - "instaCaption": String
    - "imagePrompt": String
    - "codeSnippet": String
    - "outline": String
    - "roadmap": String (A 4-week structured plan)

    ### VALIDATION:
    - Formal Email: exactly 3 paragraphs.
    - Social Caption: exactly 5 emojis, 5 hashtags.
    - Image Prompt: NO text elements or letters.
    - JSON must be raw and parseable.

    Respond with the raw JSON object only.`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const content = response.text();
    
    if (!content) {
      throw new Error("Failed to receive content from Gemini API");
    }

    const parsedResult = JSON.parse(content);
    
    return NextResponse.json(parsedResult);

  } catch (error: any) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate content. Please try again later." },
      { status: 500 }
    );
  }
}
