import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY || '';
  // In a real production app, we would handle missing keys more gracefully.
  // For this demo, we assume the environment is set up correctly as per instructions.
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

// Simulation helper for the "Next Token" game to keep it snappy without API latency
// but still realistic enough for a demo.
export const getSimulatedNextTokens = (currentText: string): Array<{ word: string, probability: number }> => {
  const lastWord = currentText.trim().split(' ').pop()?.toLowerCase() || '';
  
  const commonMap: Record<string, string[]> = {
    'the': ['cat', 'dog', 'future', 'internet', 'sky'],
    'my': ['friend', 'homework', 'pizza', 'mind', 'computer'],
    'hello': ['world', 'there', 'friend', 'human', 'computer'],
    'eat': ['pizza', 'tacos', 'code', 'data', 'burgers'],
    'is': ['cool', 'fun', 'scary', 'fast', 'smart'],
  };

  const options = commonMap[lastWord] || ['is', 'the', 'a', 'and', 'but'];
  
  // Shuffle and pick 3
  const shuffled = options.sort(() => 0.5 - Math.random()).slice(0, 3);
  
  // Assign fake probabilities that sum roughly to < 1
  let remaining = 0.9;
  return shuffled.map((word, index) => {
    const prob = index === 0 ? 0.6 : (index === 1 ? 0.2 : 0.1);
    return { word, probability: prob };
  });
};