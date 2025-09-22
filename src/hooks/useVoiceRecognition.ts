import { useState, useEffect, useRef, useCallback } from 'react';
import executiveAnalyticsService from '../services/executiveAnalyticsService';

interface VoiceCommand {
  pattern: RegExp;
  intent: string;
  handler: (matches: RegExpMatchArray, entities: Record<string, any>) => Promise<string>;
  examples: string[];
}

interface VoiceState {
  isListening: boolean;
  transcript: string;
  confidence: number;
  isProcessing: boolean;
  lastResponse: string;
  error: string | null;
  language: 'en' | 'hi';
  isSpeaking: boolean;
}

interface ConversationContext {
  previousQueries: string[];
  currentSession: string;
  userPreferences: Record<string, any>;
  lastKPIQuery: string | null;
  lastDataType: string | null;
}

export function useVoiceRecognition() {
  const [state, setState] = useState<VoiceState>({
    isListening: false,
    transcript: '',
    confidence: 0,
    isProcessing: false,
    lastResponse: '',
    error: null,
    language: 'en',
    isSpeaking: false
  });

  const [context, setContext] = useState<ConversationContext>({
    previousQueries: [],
    currentSession: Date.now().toString(),
    userPreferences: {},
    lastKPIQuery: null,
    lastDataType: null
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Enhanced NLP patterns for executive queries
  const voiceCommands: VoiceCommand[] = [
    {
      pattern: /(?:what|show me|display|tell me about)\s+(?:our|the|my)?\s*(revenue|sales|income|earnings)(?:\s+for\s+(last|this|next)\s+(month|quarter|year|week))?/i,
      intent: 'revenue_query',
      handler: async (matches, entities) => {
        const timeframe = entities.timeframe || 'current';
        const period = entities.period || 'month';
        // Simulate revenue data fetching
        return `Current ${period}ly revenue is ₹12.5 lakh with 15.8% growth compared to last ${period}. Revenue target achievement is 83%.`;
      },
      examples: ['What is our revenue?', 'Show me revenue for this quarter', 'Tell me about earnings']
    },
    {
      pattern: /(?:how|what)\s+(?:is|are|about)\s+(?:our|the)?\s*(biogas|production|output)(?:\s+(?:levels?|numbers?|statistics?))?/i,
      intent: 'production_query',
      handler: async (matches, entities) => {
        return `Current biogas production is 12,500 cubic meters per day with 12.5% growth. CBG output is 8,500 kg per day, running at 85% efficiency.`;
      },
      examples: ['How is our biogas production?', 'What are the production levels?', 'Show biogas output']
    },
    {
      pattern: /(?:what|show|tell me)\s+(?:about|are)\s+(?:our|the)?\s*(carbon|green|environmental)\s*(?:credits?|impact|footprint)/i,
      intent: 'carbon_query',
      handler: async (matches, entities) => {
        return `We have generated 450 tons of CO2 equivalent carbon credits this month, up 22.1%. Carbon credit revenue is ₹6.75 lakh with bullish market trend.`;
      },
      examples: ['What about carbon credits?', 'Show environmental impact', 'Tell me about green credits']
    },
    {
      pattern: /(?:how|what)\s+(?:is|are)\s+(?:our|the)?\s*(?:market\s+)?(?:position|share|ranking|standing)/i,
      intent: 'market_position_query',
      handler: async (matches, entities) => {
        return `We are ranked #2 in the market with 23.5% market share. Our main competitor GreenTech Solutions leads with 28.2% share.`;
      },
      examples: ['How is our market position?', 'What is our market share?', 'Where do we stand in the market?']
    },
    {
      pattern: /(?:what|show|give me)\s+(?:are|the)?\s*(?:top|best|highest)\s+(?:performing\s+)?(?:kpis?|metrics?|indicators?)/i,
      intent: 'top_kpis_query',
      handler: async (matches, entities) => {
        return `Top performing KPIs: Carbon credits up 22.1%, Revenue up 15.8%, and Biogas production up 12.5%. All are exceeding monthly targets.`;
      },
      examples: ['What are top performing KPIs?', 'Show best metrics', 'Give me highest indicators']
    },
    {
      pattern: /(?:what|which|show)\s+(?:are|me)?\s*(?:the\s+)?(?:issues?|problems?|concerns?|risks?)(?:\s+we\s+(?:have|face|need to address))?/i,
      intent: 'issues_query',
      handler: async (matches, entities) => {
        return `Main concern: Customer satisfaction declined 2.1% this month. Operational efficiency at 87% needs improvement. Competition from GreenTech Solutions requires strategic response.`;
      },
      examples: ['What issues do we have?', 'Which problems need attention?', 'Show me concerns']
    },
    {
      pattern: /(?:predict|forecast|project|estimate)\s+(?:our|the)?\s*(revenue|growth|performance|sales)(?:\s+for\s+(?:next|coming)\s+(month|quarter|year))?/i,
      intent: 'prediction_query',
      handler: async (matches, entities) => {
        const metric = matches[1];
        const period = entities.period || 'quarter';
        return `Predicted ${metric} for next ${period}: ₹16.8 lakh with 85% confidence. Growth trajectory shows 18.5% annual rate.`;
      },
      examples: ['Predict our revenue for next quarter', 'Forecast growth', 'Project performance']
    },
    {
      pattern: /(?:compare|benchmark)\s+(?:us|our\s+performance)\s+(?:with|against|to)\s+(?:competitors?|industry|market)/i,
      intent: 'comparison_query',
      handler: async (matches, entities) => {
        return `Against industry benchmarks: Biogas production 13% above average, Revenue 25% above median, Customer satisfaction 2% above industry standard.`;
      },
      examples: ['Compare us with competitors', 'Benchmark our performance', 'How do we compare to industry?']
    },
    {
      pattern: /(?:what|which)\s+(?:strategic\s+)?(?:initiatives?|projects?|plans?)\s+(?:are|do we have)(?:\s+(?:running|active|in progress))?/i,
      intent: 'strategic_initiatives_query',
      handler: async (matches, entities) => {
        return `Active strategic initiative: Market Expansion at 65% completion, ₹50 lakh budget, 240% ROI expected. Next milestone: Full rollout by December.`;
      },
      examples: ['What strategic initiatives are running?', 'Which projects are active?', 'Show strategic plans']
    },
    {
      pattern: /(?:optimize|improve|enhance|increase)\s+(?:our|the)?\s*(carbon\s+credit|revenue|production|efficiency)/i,
      intent: 'optimization_query',
      handler: async (matches, entities) => {
        const target = matches[1];
        return `To optimize ${target}: Implement IoT monitoring, expand capacity by 20%, improve process efficiency. Expected 25% improvement in 6 months.`;
      },
      examples: ['How to optimize carbon credits?', 'Improve our revenue', 'Enhance production efficiency']
    }
  ];

  // Hindi language support
  const hindiCommands: VoiceCommand[] = [
    {
      pattern: /(राजस्व|आय|कमाई|बिक्री)\s*(?:कैसी|कितनी|क्या)\s*(?:है|चल रही है)?/i,
      intent: 'revenue_query_hi',
      handler: async (matches, entities) => {
        return `वर्तमान मासिक राजस्व ₹12.5 लाख है जो पिछले महीने से 15.8% अधिक है। राजस्व लक्ष्य की 83% उपलब्धि।`;
      },
      examples: ['राजस्व कैसा है?', 'कमाई कितनी है?', 'बिक्री कैसी चल रही है?']
    },
    {
      pattern: /(बायोगैस|उत्पादन|गैस)\s*(?:का|की)?\s*(?:उत्पादन|स्थिति|डेटा)?\s*(?:कैसा|कितना|क्या)\s*(?:है|चल रहा है)?/i,
      intent: 'production_query_hi',
      handler: async (matches, entities) => {
        return `वर्तमान बायोगैस उत्पादन 12,500 घन मीटर प्रति दिन है जो 12.5% की वृद्धि दर्शाता है। CBG आउटपुट 8,500 किलो प्रति दिन।`;
      },
      examples: ['बायोगैस उत्पादन कैसा है?', 'गैस का उत्पादन कितना है?']
    },
    {
      pattern: /(कार्बन|पर्यावरण|हरित)\s*(?:क्रेडिट|प्रभाव)?\s*(?:के|का|की)?\s*(?:बारे में|स्थिति|डेटा)?\s*(?:बताएं|दिखाएं|क्या है)?/i,
      intent: 'carbon_query_hi',
      handler: async (matches, entities) => {
        return `इस महीने 450 टन CO2 समकक्ष कार्बन क्रेडिट उत्पन्न किए, 22.1% वृद्धि के साथ। कार्बन क्रेडिट राजस्व ₹6.75 लाख।`;
      },
      examples: ['कार्बन क्रेडिट के बारे में बताएं', 'पर्यावरणीय प्रभाव दिखाएं']
    }
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setState(prev => ({ ...prev, isListening: true, error: null }));
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let confidence = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            confidence = result[0].confidence;
          }
        }

        if (finalTranscript.trim()) {
          setState(prev => ({
            ...prev,
            transcript: finalTranscript.trim(),
            confidence: confidence * 100
          }));
          processVoiceCommand(finalTranscript.trim(), confidence);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setState(prev => ({
          ...prev,
          isListening: false,
          error: event.error === 'no-speech' ? 'No speech detected' : `Speech recognition error: ${event.error}`
        }));
      };

      recognition.onend = () => {
        setState(prev => ({ ...prev, isListening: false }));
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const loadVoices = () => {
        voicesRef.current = synthRef.current?.getVoices() || [];
      };

      loadVoices();
      synthRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Process voice command with NLP
  const processVoiceCommand = useCallback(async (transcript: string, confidence: number) => {
    setState(prev => ({ ...prev, isProcessing: true }));

    try {
      // Add to conversation context
      setContext(prev => ({
        ...prev,
        previousQueries: [...prev.previousQueries.slice(-9), transcript]
      }));

      const commands = state.language === 'hi' ? hindiCommands : voiceCommands;
      let response = '';
      let intentFound = false;

      // Try to match patterns
      for (const command of commands) {
        const match = transcript.match(command.pattern);
        if (match) {
          intentFound = true;

          // Extract entities
          const entities = extractEntities(transcript, match);

          try {
            response = await command.handler(match, entities);

            // Update context based on intent
            updateContextFromIntent(command.intent, entities);

            break;
          } catch (error) {
            response = state.language === 'hi'
              ? 'डेटा प्राप्त करने में त्रुटि हुई।'
              : 'Error retrieving data.';
          }
        }
      }

      // Fallback to general processing
      if (!intentFound) {
        try {
          const result = await executiveAnalyticsService.processVoiceQuery(
            transcript,
            state.language,
            context
          );
          response = result.response;

          // Update context with API result
          if (result.entities) {
            setContext(prev => ({
              ...prev,
              lastKPIQuery: result.entities.kpi || prev.lastKPIQuery,
              lastDataType: result.entities.dataType || prev.lastDataType
            }));
          }
        } catch (error) {
          response = generateFallbackResponse(transcript);
        }
      }

      setState(prev => ({
        ...prev,
        lastResponse: response,
        isProcessing: false
      }));

      // Speak the response
      await speakResponse(response);

    } catch (error) {
      console.error('Voice processing error:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to process voice command',
        isProcessing: false
      }));
    }
  }, [state.language, context]);

  // Extract entities from transcript
  const extractEntities = (transcript: string, match: RegExpMatchArray): Record<string, any> => {
    const entities: Record<string, any> = {};

    // Time-related entities
    const timePatterns = {
      'last': /(?:last|previous|past)\s+(week|month|quarter|year)/i,
      'this': /(?:this|current)\s+(week|month|quarter|year)/i,
      'next': /(?:next|coming|future)\s+(week|month|quarter|year)/i
    };

    for (const [key, pattern] of Object.entries(timePatterns)) {
      const timeMatch = transcript.match(pattern);
      if (timeMatch) {
        entities.timeframe = key;
        entities.period = timeMatch[1];
        break;
      }
    }

    // Number entities
    const numberMatch = transcript.match(/(\d+(?:\.\d+)?)\s*(?:percent|%|lakh|crore|thousand|million)/i);
    if (numberMatch) {
      entities.number = parseFloat(numberMatch[1]);
    }

    // Comparison entities
    if (/compare|versus|against|vs/i.test(transcript)) {
      entities.comparison = true;
    }

    // Prediction entities
    if (/predict|forecast|project|estimate/i.test(transcript)) {
      entities.prediction = true;
    }

    return entities;
  };

  // Update conversation context
  const updateContextFromIntent = (intent: string, entities: Record<string, any>) => {
    setContext(prev => {
      const updates: Partial<ConversationContext> = {};

      if (intent.includes('revenue') || intent.includes('financial')) {
        updates.lastDataType = 'revenue';
      } else if (intent.includes('production') || intent.includes('biogas')) {
        updates.lastDataType = 'production';
      } else if (intent.includes('carbon')) {
        updates.lastDataType = 'carbon';
      }

      if (intent.includes('kpi') || intent.includes('metrics')) {
        updates.lastKPIQuery = intent;
      }

      return { ...prev, ...updates };
    });
  };

  // Generate fallback response
  const generateFallbackResponse = (transcript: string): string => {
    const fallbacks = {
      en: [
        "I understand you're asking about our business metrics. Could you please be more specific?",
        "I can help with KPIs, revenue, production, or carbon credits. What would you like to know?",
        "Let me assist you with executive analytics. Please specify which metric you're interested in.",
        "I can provide insights on performance, market position, or strategic planning. What's your focus?"
      ],
      hi: [
        "मैं समझ गया कि आप व्यावसायिक मेट्रिक्स के बारे में पूछ रहे हैं। कृपया अधिक स्पष्ट रूप से बताएं?",
        "मैं KPI, राजस्व, उत्पादन, या कार्बन क्रेडिट में मदद कर सकता हूं। आप क्या जानना चाहते हैं?",
        "मैं प्रदर्शन, बाज़ार स्थिति, या रणनीतिक योजना पर जानकारी दे सकता हूं। आपका फोकस क्या है?"
      ]
    };

    const responses = fallbacks[state.language];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Speak response
  const speakResponse = useCallback(async (text: string): Promise<void> => {
    if (!synthRef.current || state.isSpeaking) return;

    return new Promise((resolve) => {
      setState(prev => ({ ...prev, isSpeaking: true }));

      const utterance = new SpeechSynthesisUtterance(text);

      // Select appropriate voice
      const voices = voicesRef.current;
      let selectedVoice = null;

      if (state.language === 'hi') {
        selectedVoice = voices.find(voice =>
          voice.lang.includes('hi') || voice.name.toLowerCase().includes('hindi')
        );
      } else {
        selectedVoice = voices.find(voice =>
          voice.lang.includes('en') && voice.name.toLowerCase().includes('female')
        ) || voices.find(voice => voice.lang.includes('en'));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      utterance.onend = () => {
        setState(prev => ({ ...prev, isSpeaking: false }));
        resolve();
      };

      utterance.onerror = () => {
        setState(prev => ({ ...prev, isSpeaking: false }));
        resolve();
      };

      synthRef.current?.speak(utterance);
    });
  }, [state.language, state.isSpeaking]);

  // Control functions
  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening) {
      // Set language for recognition
      recognitionRef.current.lang = state.language === 'hi' ? 'hi-IN' : 'en-US';
      recognitionRef.current.start();
    }
  }, [state.isListening, state.language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }
  }, [state.isListening]);

  const toggleLanguage = useCallback(() => {
    setState(prev => ({
      ...prev,
      language: prev.language === 'en' ? 'hi' : 'en',
      transcript: '',
      lastResponse: ''
    }));
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  const clearContext = useCallback(() => {
    setContext({
      previousQueries: [],
      currentSession: Date.now().toString(),
      userPreferences: {},
      lastKPIQuery: null,
      lastDataType: null
    });
  }, []);

  return {
    // State
    ...state,
    context,

    // Actions
    startListening,
    stopListening,
    toggleLanguage,
    stopSpeaking,
    clearContext,
    speakResponse,

    // Computed
    isSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    availableVoices: voicesRef.current,
    canSpeak: 'speechSynthesis' in window,

    // Advanced features
    processVoiceCommand: (text: string) => processVoiceCommand(text, 1.0),
    getConversationHistory: () => context.previousQueries,
    getSuggestedQueries: () => {
      const suggestions = state.language === 'hi' ? [
        'राजस्व कैसा है?',
        'बायोगैस उत्पादन दिखाएं',
        'कार्बन क्रेडिट की स्थिति',
        'टॉप परफॉर्मिंग KPIs'
      ] : [
        'What is our revenue?',
        'Show biogas production',
        'Carbon credit status',
        'Top performing KPIs'
      ];
      return suggestions;
    }
  };
}