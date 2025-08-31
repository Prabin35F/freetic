

import { GoogleGenAI, GenerateContentResponse, GroundingChunk } from "@google/genai";
import { Quote, Book } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Quote generation will use fallback data. Ensure process.env.API_KEY is set.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

interface FetchQuoteResponse {
    quote: Quote | null;
    groundingChunks?: GroundingChunk[] | null;
}

export const fetchRandomTruthQuote = async (topic: string = "life, wisdom, or philosophy"): Promise<FetchQuoteResponse> => {
  if (!ai) {
    console.warn("Gemini AI client not initialized. Cannot fetch quote.");
    return { quote: null };
  }

  // Updated prompt based on "COMPREHENSIVE MASTER PROMPT"
  const prompt = `
    Generate a brutal, unfiltered truth quote about ${topic}.
    The quote must capture an essential, raw insight.
    Style: Direct, impactful, thought-provoking. No fluff.
    Length: Maximum 280 characters, ideally one concise sentence.
    Tone: Matches a brand voice like "Some Unfiltered Knowledge" - intelligent, slightly edgy, and honest.
    If possible, attribute to a known philosopher, thinker, or a relevant classic book ONLY if it's a genuine and fitting attribution. Prioritize a powerful original quote if a natural attribution isn't available or strong.
    Output format should be just the quote, or "Quote text" - Author (Source) if attributed.
  `;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7, // Slightly lower for more focused quotes
        topP: 0.9,
        topK: 40,
        // tools: [{ googleSearch: {} }], // Enable if direct web sourcing for quotes is desired
      }
    });

    const text = response.text;
    if (text) {
      const quoteParts = text.match(/^"(.+?)"(?: - (.+?)(?: \((.+?)\))?)?$/);
      let parsedQuote: Quote;

      if (quoteParts && quoteParts[1]) {
        parsedQuote = {
          id: Date.now().toString(),
          text: quoteParts[1].trim(),
          author: quoteParts[2] ? quoteParts[2].trim() : undefined,
          sourceBook: quoteParts[3] ? quoteParts[3].trim() : undefined,
        };
      } else {
        // Fallback for non-matching or unattributed quotes
        let cleanedText = text.trim();
        // Remove potential leading/trailing quotes if not caught by regex
        if (cleanedText.startsWith('"') && cleanedText.endsWith('"')) {
            cleanedText = cleanedText.substring(1, cleanedText.length - 1);
        }
        parsedQuote = {
          id: Date.now().toString(),
          text: cleanedText,
        };
      }
      
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const groundingChunks = groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

      return { quote: parsedQuote, groundingChunks: groundingChunks };
    }
    return { quote: null };
  } catch (error) {
    console.error("Error fetching quote from Gemini API:", error);
    throw error;
  }
};

export const getAIRecommendations = async (
  userQuery: string,
  books: Book[]
): Promise<string[]> => {
  if (!ai) {
    throw new Error("Gemini AI client not initialized. API Key may be missing.");
  }

  const bookCatalog = books.map(book => ({
    id: book.id,
    title: book.title,
    summary: book.detailedSummary,
    hook: book.oneLinerHook,
    truth: book.brutalTruth,
    whyThisBookIsPerfect: book.whyThisBookIsPerfect,
    tags: book.tags,
    category: book.category,
  }));

  const prompt = `You are a world-class book recommendation assistant for an app called Freetic. Your task is to analyze a user's free-text input describing their problem, goal, or feeling, and recommend 3 to 5 of the most relevant books from the provided catalog.

  **Instructions:**
  1.  Carefully analyze the user's query: "${userQuery}". Identify the core intent, emotion, and desired outcome.
  2.  Scan the provided book catalog. Match the user's intent with the book's title, summary, hook, truth, "why this book is perfect" section, tags, and category.
  3.  Prioritize books that directly address the user's stated problem.
  4.  You MUST return your response as a JSON object.
  5.  The JSON object must have a single key: "recommended_book_ids".
  6.  The value of "recommended_book_ids" must be an array of strings.
  7.  Each string in the array must be the exact 'id' of a book from the catalog.
  8.  Do not include books that are not a strong match. It's better to recommend 3 great matches than 5 weak ones.
  9.  Do NOT add any explanation or text outside of the JSON object.

  **Available Book Catalog:**
  ${JSON.stringify(bookCatalog)}
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3, 
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);
    if (parsedData.recommended_book_ids && Array.isArray(parsedData.recommended_book_ids)) {
      return parsedData.recommended_book_ids;
    }
    
    console.warn("AI response was valid JSON but missing 'recommended_book_ids' array.", parsedData);
    return [];

  } catch (error) {
    console.error("Error getting AI recommendations:", error);
    throw new Error("Failed to get recommendations from AI service.");
  }
};
