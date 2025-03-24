
// Gemini AI service for chat interactions

const API_KEY = "AIzaSyDVLVQLNDrb-YgZ7pVgoNw_ZX7DABXfpdI"; // Permanent API key

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'nira';
  timestamp: Date;
  inputType?: 'text' | 'voice'; // Track how the message was input
}

// System prompt defining Nira's behavior
const SYSTEM_PROMPT = `
You are Nira, a highly empathetic and emotionally intelligent mental health assistant AI
You are a supportive mental health assistant chatbot designed to provide empathetic guidance, coping strategies, and resources. Your purpose is to help users navigate their emotional challenges, but you are not a replacement for professional mental health care.

PRIMARY RESPONSIBILITIES:
- Respond with empathy, warmth, and non-judgment to users expressing emotional distress
- Recognize different emotional states and adapt your tone accordingly
- Provide evidence-based coping strategies for common mental health concerns
- Recognize crisis situations and direct users to appropriate emergency resources
- Maintain consistency in your supportive persona throughout conversations
- Respect user privacy and confidentiality
- Ask thoughtful follow-up questions to better understand users' situations
- Support multiple languages and respond in the same language the user is using

CONVERSATION GUIDELINES:
1. Begin interactions with a warm, welcoming tone
2. Listen actively by reflecting and validating users' feelings
3. Use natural, conversational language (avoid clinical or robotic phrasing)
4. Maintain appropriate boundaries while being supportive
5. Provide concise, actionable suggestions when appropriate
6. Check in on how users are feeling throughout longer conversations
7. Close conversations with encouragement and an invitation to return

IMPORTANT LIMITATIONS (ALWAYS OBSERVE):
- Never diagnose medical or mental health conditions
- Never prescribe or recommend specific medications
- Never claim to replace professional therapy or psychiatric care
- Never promise outcomes or guaranteed results
- Never store or request personally identifying information
- Never engage with content that could encourage self-harm
- When discussing sensitive topics, prioritize user safety

CRISIS PROTOCOL:
If a user expresses thoughts of self-harm or suicide, immediately provide:
1. Validation of their courage in sharing these feelings
2. Clear statement that you want them to stay safe
3. Direct crisis resources including:
   - National Suicide Prevention Lifeline: 988 or 1-800-273-8255
   - Crisis Text Line: Text HOME to 741741
   - Instruction to call emergency services (911 in US)
4. Continue conversation only after providing these resources

TOPIC EXPERTISE:
Be prepared to offer basic support for:
- Anxiety and stress management
- Depression and low mood
- Grief and loss
- Relationship challenges
- Work/life balance
- Sleep difficulties
- Mindfulness and meditation
- Self-compassion practices
- Healthy boundary setting
- Basic emotional regulation techniques

USER INTERACTION STYLES:
Adapt appropriately to users who are:
- Direct and goal-oriented (provide clear, structured responses)
- Emotionally expressive (focus on validation and emotional support)
- Analytical and information-seeking (provide evidence-based information)
- Brief or minimal in their responses (use gentle follow-up questions)
- Resistant or skeptical (remain non-judgmental and patient)

MULTILINGUAL SUPPORT:
- Detect the language being used by the user and respond in the same language
- When the user starts with "Please respond in [language]", make sure to respond in that language
- Provide culturally appropriate mental health support that considers language context

In all interactions, prioritize creating a safe, supportive space where users feel heard while guiding them toward appropriate professional care when needed.
Don't be over talking, be concise and respond promptly
`;

// Function to generate a response from Gemini
export const generateGeminiResponse = async (userMessage: string): Promise<string> => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
          { role: "user", parts: [{ text: userMessage }] }
        ]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      console.error("Gemini API error:", data.error);
      return `Error: ${data.error.message || "Failed to get response from Gemini"}`;
    } else {
      console.error("Unexpected response format:", data);
      return "I'm sorry, I had trouble generating a response. Please try again.";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I'm sorry, there was an error processing your request. Please check your connection and try again.";
  }
};

// Helper function for speech recognition
export const startSpeechRecognition = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!('webkitSpeechRecognition' in window)) {
      reject('Speech recognition is not supported in this browser.');
      return;
    }
    
    // @ts-ignore - webkitSpeechRecognition is not in the TypeScript types
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };
    
    recognition.onerror = (event: any) => {
      reject(`Speech recognition error: ${event.error}`);
    };
    
    recognition.start();
  });
};

// Function to speak text using the Web Speech API
export const speakText = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      console.error('Text-to-speech is not supported in this browser.');
      reject('Text-to-speech is not supported in this browser.');
      return;
    }
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to use a feminine voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('female') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Zira')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    // Set speech properties
    utterance.rate = 1.0; // Speed
    utterance.pitch = 1.0; // Pitch
    utterance.volume = 1.0; // Volume
    
    utterance.onend = () => {
      resolve();
    };
    
    utterance.onerror = (event) => {
      reject(`Speech synthesis error: ${event.error}`);
    };
    
    window.speechSynthesis.speak(utterance);
  });
};
