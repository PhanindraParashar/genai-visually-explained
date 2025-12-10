import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

export const generateChatResponse = async (
  message: string,
  systemInstruction: string,
  modelName: string = 'gemini-2.5-flash'
): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: modelName,
      contents: message,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! My brain circuit tripped. Check the console.";
  }
};

// A simple Trie-like structure for the demo
const TOKEN_TREE: Record<string, Array<{word: string, prob: number}>> = {
  "start": [
    { word: "The", prob: 0.4 },
    { word: "A", prob: 0.2 },
    { word: "My", prob: 0.2 },
    { word: "Coding", prob: 0.1 }
  ],
  "the": [
    { word: "cat", prob: 0.35 },
    { word: "future", prob: 0.25 },
    { word: "dog", prob: 0.2 },
    { word: "internet", prob: 0.1 }
  ],
  "the cat": [
    { word: "sat", prob: 0.6 },
    { word: "ate", prob: 0.2 },
    { word: "is", prob: 0.1 }
  ],
  "the cat sat": [
    { word: "on", prob: 0.8 },
    { word: "under", prob: 0.15 },
    { word: "happily", prob: 0.05 }
  ],
  "the cat sat on": [
    { word: "the", prob: 0.7 },
    { word: "my", prob: 0.2 },
    { word: "a", prob: 0.1 }
  ],
  "the cat sat on the": [
    { word: "mat", prob: 0.5 },
    { word: "roof", prob: 0.3 },
    { word: "keyboard", prob: 0.2 }
  ],
  "the future": [
    { word: "is", prob: 0.5 },
    { word: "looks", prob: 0.3 },
    { word: "belongs", prob: 0.2 }
  ],
  "the future is": [
    { word: "bright", prob: 0.4 },
    { word: "now", prob: 0.4 },
    { word: "scary", prob: 0.2 }
  ],
  "my": [
    { word: "homework", prob: 0.4 },
    { word: "friend", prob: 0.3 },
    { word: "pizza", prob: 0.2 }
  ]
};

export const getSimulatedNextTokens = (currentText: string): Array<{ word: string, probability: number }> => {
  const normalizedText = currentText.trim().toLowerCase();
  
  // Try to find exact match in tree
  let options = TOKEN_TREE[normalizedText];

  // If no exact match, try matching the last word
  if (!options) {
    const lastWord = normalizedText.split(' ').pop() || '';
    options = TOKEN_TREE[lastWord];
  }

  // Fallback if completely unknown
  if (!options) {
     const fallbacks = ['is', 'and', 'the', 'but', 'because', 'very', 'amazing'];
     options = fallbacks.map(w => ({ word: w, prob: Math.random() }));
  }

  // Add some noise/randomness to make probabilities sum to ~1 and vary slightly
  return options.map(opt => ({
    word: opt.word,
    probability: Math.min(0.99, opt.prob + (Math.random() * 0.05))
  })).sort((a,b) => b.probability - a.probability).slice(0, 3);
};