import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  MessageSquare,
  Brain,
  Languages,
  History,
  TrendingUp,
  DollarSign,
  Leaf,
  Users,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useExecutiveAnalytics } from '../../contexts/ExecutiveAnalyticsContext';
import { useAuth } from '../../contexts/AuthContext';

interface VoiceSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  queries: number;
  language: 'en' | 'hi';
  accuracy: number;
  userId: string;
  consentGiven: boolean;
  dataRetention: 'session' | 'encrypted' | 'permanent';
  privacyLevel: 'high' | 'medium' | 'standard';
  encryptionEnabled: boolean;
}

interface VoicePrivacySettings {
  consentRequired: boolean;
  sessionTimeout: number; // in minutes
  dataRetention: 'session' | 'encrypted' | 'permanent';
  encryptionEnabled: boolean;
  anonymizeTranscripts: boolean;
  blockSensitiveData: boolean;
}

interface VoiceCommand {
  command: string;
  description: string;
  examples: string[];
  category: 'kpi' | 'financial' | 'strategic' | 'environmental';
}

const VoiceAnalytics: React.FC = () => {
  const { addVoiceQuery, kpis, carbonMetrics, competitiveData } = useExecutiveAnalytics();
  const { user, hasPermission, isExecutive, getAccessLevel } = useAuth();

  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [confidence, setConfidence] = useState(0);
  const [currentSession, setCurrentSession] = useState<VoiceSession | null>(null);
  const [queryHistory, setQueryHistory] = useState<any[]>([]);

  // Privacy and security states
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [privacySettings, setPrivacySettings] = useState<VoicePrivacySettings>({
    consentRequired: true,
    sessionTimeout: isExecutive() ? 30 : 60, // Shorter timeout for executives
    dataRetention: isExecutive() ? 'encrypted' : 'session',
    encryptionEnabled: true,
    anonymizeTranscripts: !isExecutive(), // Don't anonymize for executives who need full context
    blockSensitiveData: true
  });
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number>(0);
  const [encryptedData, setEncryptedData] = useState<string>('');
  const [privacyMode, setPrivacyMode] = useState(false);

  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Privacy and encryption utilities
  const simpleEncrypt = (text: string): string => {
    // Simple encryption for demo - in production, use proper encryption
    return btoa(text.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join(''));
  };

  const simpleDecrypt = (encryptedText: string): string => {
    try {
      return atob(encryptedText).split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('');
    } catch {
      return encryptedText;
    }
  };

  const sanitizeSensitiveData = (text: string): string => {
    if (!privacySettings.blockSensitiveData) return text;

    // Remove potential sensitive information patterns
    return text
      .replace(/\b\d{12,16}\b/g, '[CARD-REDACTED]') // Credit card numbers
      .replace(/\b\d{10,15}\b/g, '[PHONE-REDACTED]') // Phone numbers
      .replace(/\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}\b/g, '[IBAN-REDACTED]') // IBAN
      .replace(/\b\d{4}-\d{4}-\d{4}-\d{4}\b/g, '[ACCOUNT-REDACTED]') // Account numbers
      .replace(/password|pin|secret|confidential/gi, '[SENSITIVE-REDACTED]');
  };

  const anonymizeTranscript = (text: string): string => {
    if (!privacySettings.anonymizeTranscripts) return text;

    // Replace names and personal identifiers
    return text
      .replace(/\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, '[NAME-REDACTED]')
      .replace(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, '[EMAIL-REDACTED]');
  };

  // Voice command categories
  const voiceCommands: VoiceCommand[] = [
    {
      command: 'Revenue Summary',
      description: 'Get current revenue metrics and growth trends',
      examples: [
        'What is our monthly revenue?',
        'मासिक आय कितनी है?',
        'Show me revenue growth',
        'Revenue trends this quarter'
      ],
      category: 'financial'
    },
    {
      command: 'Production Analytics',
      description: 'Biogas production and efficiency metrics',
      examples: [
        'How much biogas did we produce today?',
        'आज कितना बायोगैस उत्पादन हुआ?',
        'Show production efficiency',
        'Which plants are performing best?'
      ],
      category: 'kpi'
    },
    {
      command: 'Carbon Credits',
      description: 'Environmental impact and carbon credit revenue',
      examples: [
        'How many carbon credits did we generate?',
        'कार्बन क्रेडिट कितने जेनरेट हुए?',
        'Carbon revenue projections',
        'Environmental impact summary'
      ],
      category: 'environmental'
    },
    {
      command: 'Strategic Planning',
      description: 'Market position and strategic initiatives',
      examples: [
        'What is our market share?',
        'बाजार में हमारी स्थिति क्या है?',
        'Strategic initiative progress',
        'Competitive analysis summary'
      ],
      category: 'strategic'
    }
  ];

  // Executive query patterns
  const executiveQueries = {
    revenue: [
      /(?:what|how much|tell me).*(?:revenue|sales|income|earnings)/i,
      /(?:मासिक|कुल).*(?:आय|राजस्व|कमाई)/i,
      /(?:show|display).*(?:financial|revenue).*(?:performance|metrics)/i
    ],
    production: [
      /(?:what|how much).*(?:production|biogas|output)/i,
      /(?:आज|कुल).*(?:उत्पादन|बायोगैस)/i,
      /(?:efficiency|performance).*(?:plant|production)/i
    ],
    carbon: [
      /(?:what|how many).*(?:carbon|credits|environmental)/i,
      /(?:कार्बन|पर्यावरण).*(?:क्रेडिट|प्रभाव)/i,
      /(?:sustainability|green|environmental).*(?:impact|metrics)/i
    ],
    strategic: [
      /(?:what|how).*(?:market|position|share|competitive)/i,
      /(?:बाजार|प्रतिस्पर्धा).*(?:स्थिति|विश्लेषण)/i,
      /(?:strategic|planning|initiatives)/i
    ],
    forecast: [
      /(?:what|show).*(?:forecast|prediction|projection)/i,
      /(?:भविष्यवाणी|पूर्वानुमान|अनुमान)/i,
      /(?:future|next).*(?:quarter|year|month)/i
    ]
  };

  // Session management and consent handling
  const requestVoiceConsent = () => {
    if (!user) return false;

    if (privacySettings.consentRequired && !consentGiven) {
      setShowConsentDialog(true);
      return false;
    }
    return true;
  };

  const grantConsent = () => {
    setConsentGiven(true);
    setShowConsentDialog(false);
    console.log(`Voice consent granted for ${user?.name} (${user?.role})`);

    // Store consent with timestamp
    const consentData = {
      userId: user?.id,
      granted: true,
      timestamp: new Date().toISOString(),
      privacyLevel: getAccessLevel()
    };
    localStorage.setItem('voiceConsent', JSON.stringify(consentData));
  };

  const startVoiceSession = () => {
    if (!user || !requestVoiceConsent()) return;

    const sessionId = `voice-session-${Date.now()}`;
    const newSession: VoiceSession = {
      id: sessionId,
      startTime: new Date(),
      queries: 0,
      language,
      accuracy: 0,
      userId: user.id,
      consentGiven: true,
      dataRetention: privacySettings.dataRetention,
      privacyLevel: getAccessLevel() === 'high' ? 'high' : 'standard',
      encryptionEnabled: privacySettings.encryptionEnabled
    };

    setCurrentSession(newSession);
    setSessionTimeRemaining(privacySettings.sessionTimeout * 60); // Convert to seconds

    // Set session timeout
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    sessionTimeoutRef.current = setTimeout(() => {
      endVoiceSession();
    }, privacySettings.sessionTimeout * 60 * 1000);

    console.log(`Voice session started for ${user.name} - Session ID: ${sessionId}`);
  };

  const endVoiceSession = () => {
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        endTime: new Date()
      };

      // Handle data based on retention policy
      if (privacySettings.dataRetention === 'session') {
        // Clear all session data
        console.log('Clearing session data as per privacy policy');
        localStorage.removeItem('voiceSessionData');
      } else if (privacySettings.dataRetention === 'encrypted') {
        // Encrypt and store
        const encryptedSessionData = simpleEncrypt(JSON.stringify(updatedSession));
        localStorage.setItem('voiceSessionData', encryptedSessionData);
        console.log('Session data encrypted and stored');
      }

      setCurrentSession(null);
      setSessionTimeRemaining(0);
      setIsListening(false);

      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }

      console.log(`Voice session ended - Duration: ${Math.round((Date.now() - currentSession.startTime.getTime()) / 1000)}s`);
    }
  };

  const processVoiceInput = (input: string) => {
    if (!currentSession || !user) return;

    // Apply privacy filters
    let processedInput = input;
    processedInput = sanitizeSensitiveData(processedInput);
    processedInput = anonymizeTranscript(processedInput);

    // Encrypt if required
    if (privacySettings.encryptionEnabled) {
      const encryptedInput = simpleEncrypt(processedInput);
      setEncryptedData(encryptedInput);
    }

    // Update session
    const updatedSession = {
      ...currentSession,
      queries: currentSession.queries + 1
    };
    setCurrentSession(updatedSession);

    console.log(`Processed voice input (Privacy Level: ${updatedSession.privacyLevel}):`,
                privacyMode ? '[REDACTED]' : processedInput);
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            setConfidence(result[0].confidence);
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          // Process with privacy controls
          processVoiceInput(finalTranscript);
          processVoiceQuery(finalTranscript, result[0].confidence);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    synthRef.current = speechSynthesis;
  }, [language]);

  // Session timeout monitoring
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (currentSession && sessionTimeRemaining > 0) {
      interval = setInterval(() => {
        setSessionTimeRemaining(prev => {
          if (prev <= 1) {
            endVoiceSession();
            return 0;
          }

          // Warning at 5 minutes remaining
          if (prev === 300) {
            console.warn('Voice session will expire in 5 minutes');
            if (isExecutive()) {
              speakResponse(language === 'hi'
                ? 'सेशन 5 मिनट में समाप्त हो जाएगा'
                : 'Session will expire in 5 minutes');
            }
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentSession, sessionTimeRemaining]);

  // Check for existing consent on component mount
  useEffect(() => {
    if (user) {
      const storedConsent = localStorage.getItem('voiceConsent');
      if (storedConsent) {
        try {
          const consentData = JSON.parse(storedConsent);
          if (consentData.userId === user.id && consentData.granted) {
            // Check if consent is still valid (24 hours for executives, 7 days for others)
            const consentAge = Date.now() - new Date(consentData.timestamp).getTime();
            const maxConsentAge = isExecutive() ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

            if (consentAge < maxConsentAge) {
              setConsentGiven(true);
            } else {
              localStorage.removeItem('voiceConsent');
            }
          }
        } catch (error) {
          console.error('Error parsing stored consent:', error);
          localStorage.removeItem('voiceConsent');
        }
      }
    }
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      if (currentSession) {
        endVoiceSession();
      }
    };
  }, []);

  // Process voice queries with advanced NLP
  const processVoiceQuery = async (query: string, confidence: number) => {
    const queryType = identifyQueryType(query);
    const response = await generateResponse(queryType, query);

    // Add to voice history
    const voiceQuery = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
      response: response.text,
      confidence,
      category: queryType,
      language
    };

    addVoiceQuery(voiceQuery);
    setQueryHistory(prev => [voiceQuery, ...prev.slice(0, 9)]);

    // Speak response
    if (response.spoken) {
      speakResponse(response.spoken);
    }

    // Update session metrics
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        queries: prev.queries + 1,
        accuracy: (prev.accuracy + confidence) / 2
      } : null);
    }
  };

  const identifyQueryType = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    for (const [type, patterns] of Object.entries(executiveQueries)) {
      if (patterns.some(pattern => pattern.test(lowerQuery))) {
        return type;
      }
    }

    return 'general';
  };

  const generateResponse = async (queryType: string, query: string) => {
    const responses: Record<string, any> = {
      revenue: {
        text: `Current monthly revenue is ₹${(kpis.find(k => k.id === 'revenue')?.value || 0 / 10000000).toFixed(1)} crores, showing ${kpis.find(k => k.id === 'revenue')?.change || 0}% growth this month.`,
        spoken: language === 'hi'
          ? `वर्तमान मासिक आय ${(kpis.find(k => k.id === 'revenue')?.value || 0 / 10000000).toFixed(1)} करोड़ रुपए है, जो इस महीने ${kpis.find(k => k.id === 'revenue')?.change || 0}% की वृद्धि दिखा रहा है।`
          : `Current monthly revenue is ${(kpis.find(k => k.id === 'revenue')?.value || 0 / 10000000).toFixed(1)} crores, showing ${kpis.find(k => k.id === 'revenue')?.change || 0}% growth this month.`
      },
      production: {
        text: `Biogas production is ${kpis.find(k => k.id === 'production')?.value || 0} cubic meters per day with ${kpis.find(k => k.id === 'efficiency')?.value || 0}% efficiency.`,
        spoken: language === 'hi'
          ? `बायोगैस उत्पादन प्रतिदिन ${kpis.find(k => k.id === 'production')?.value || 0} क्यूबिक मीटर है, जिसकी दक्षता ${kpis.find(k => k.id === 'efficiency')?.value || 0}% है।`
          : `Biogas production is ${kpis.find(k => k.id === 'production')?.value || 0} cubic meters per day with ${kpis.find(k => k.id === 'efficiency')?.value || 0}% efficiency.`
      },
      carbon: {
        text: `We generated ${carbonMetrics.creditsGenerated} tons of carbon credits worth ₹${(carbonMetrics.marketValue / 100000).toFixed(1)} lakhs.`,
        spoken: language === 'hi'
          ? `हमने ${carbonMetrics.creditsGenerated} टन कार्बन क्रेडिट जेनरेट किए हैं जिनकी कीमत ${(carbonMetrics.marketValue / 100000).toFixed(1)} लाख रुपए है।`
          : `We generated ${carbonMetrics.creditsGenerated} tons of carbon credits worth ${(carbonMetrics.marketValue / 100000).toFixed(1)} lakhs rupees.`
      },
      strategic: {
        text: `Our market share is ${competitiveData.marketShare}% and we rank #${competitiveData.ranking} in the industry.`,
        spoken: language === 'hi'
          ? `हमारी बाजार हिस्सेदारी ${competitiveData.marketShare}% है और हम उद्योग में ${competitiveData.ranking} नंबर पर हैं।`
          : `Our market share is ${competitiveData.marketShare}% and we rank number ${competitiveData.ranking} in the industry.`
      }
    };

    return responses[queryType] || {
      text: 'I can help you with revenue, production, carbon credits, or strategic planning metrics.',
      spoken: language === 'hi'
        ? 'मैं आपकी आय, उत्पादन, कार्बन क्रेडिट, या रणनीतिक योजना मेट्रिक्स में मदद कर सकता हूं।'
        : 'I can help you with revenue, production, carbon credits, or strategic planning metrics.'
    };
  };

  const speakResponse = (text: string) => {
    if (synthRef.current) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    // Check permissions first
    if (!user || !hasPermission('voice', 'query')) {
      alert('You do not have permission to use voice analytics');
      return;
    }

    if (!requestVoiceConsent()) {
      return; // Consent dialog will be shown
    }

    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();

      // Start session if none exists
      if (!currentSession) {
        startVoiceSession();
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'en' ? 'hi-IN' : 'en-US';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Voice Analytics Assistant</h2>
          <p className="text-gray-600">Advanced voice-enabled business intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={toggleLanguage}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Languages className="h-4 w-4" />
            {language === 'en' ? 'हिंदी' : 'English'}
          </Button>
        </div>
      </div>

      {/* Privacy Controls and Session Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Privacy Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4" />
              Privacy Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Data Encryption</span>
              <Badge variant={privacySettings.encryptionEnabled ? "default" : "secondary"}>
                {privacySettings.encryptionEnabled ? "ON" : "OFF"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Privacy Level</span>
              <Badge variant="outline">
                {getAccessLevel().toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Data Retention</span>
              <Badge variant="secondary">
                {privacySettings.dataRetention.toUpperCase()}
              </Badge>
            </div>
            <Button
              onClick={() => setPrivacyMode(!privacyMode)}
              variant="outline"
              size="sm"
              className="w-full mt-2"
            >
              {privacyMode ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
              {privacyMode ? 'Show Data' : 'Hide Data'}
            </Button>
          </CardContent>
        </Card>

        {/* Session Timer */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              Session Timer
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentSession ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold text-center">
                  {Math.floor(sessionTimeRemaining / 60)}:{(sessionTimeRemaining % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-center text-gray-500">Time Remaining</div>
                {sessionTimeRemaining <= 300 && (
                  <Alert className="p-2">
                    <AlertTriangle className="h-3 w-3" />
                    <AlertDescription className="text-xs">
                      Session expiring soon!
                    </AlertDescription>
                  </Alert>
                )}
                <Button
                  onClick={endVoiceSession}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  End Session
                </Button>
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm">
                No active session
              </div>
            )}
          </CardContent>
        </Card>

        {/* Consent Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Lock className="h-4 w-4" />
              Consent Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Voice Recording</span>
                <Badge variant={consentGiven ? "default" : "destructive"}>
                  {consentGiven ? "ALLOWED" : "DENIED"}
                </Badge>
              </div>
              <div className="text-xs text-gray-500">
                User: {user?.name}
              </div>
              <div className="text-xs text-gray-500">
                Role: {user?.role?.toUpperCase()}
              </div>
              {!consentGiven && (
                <Button
                  onClick={() => setShowConsentDialog(true)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Grant Consent
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consent Dialog */}
      {showConsentDialog && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Shield className="h-5 w-5" />
              Voice Analytics Consent Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-orange-700">
              <p className="mb-2">
                <strong>SAUBHAGYA Voice Analytics</strong> requests permission to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Record and process your voice queries</li>
                <li>Analyze speech patterns for business intelligence</li>
                <li>Store session data according to privacy settings</li>
                <li>Apply role-based access controls for data security</li>
              </ul>

              <div className="mt-4 p-3 bg-white rounded border">
                <h4 className="font-medium text-gray-900 mb-2">Privacy Settings for {user?.name}:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Session Timeout: <span className="font-medium">{privacySettings.sessionTimeout} minutes</span></div>
                  <div>Data Retention: <span className="font-medium">{privacySettings.dataRetention}</span></div>
                  <div>Encryption: <span className="font-medium">{privacySettings.encryptionEnabled ? 'Enabled' : 'Disabled'}</span></div>
                  <div>Anonymization: <span className="font-medium">{privacySettings.anonymizeTranscripts ? 'Enabled' : 'Disabled'}</span></div>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-600">
                By clicking "Grant Consent", you agree to voice data processing under SAUBHAGYA privacy policy.
                {isExecutive() && " Executive sessions have enhanced security and shorter timeouts."}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={grantConsent}
                className="flex-1"
              >
                <Shield className="h-4 w-4 mr-2" />
                Grant Consent
              </Button>
              <Button
                onClick={() => setShowConsentDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Session */}
      {currentSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Current Voice Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{currentSession.queries}</div>
                <div className="text-sm text-gray-500">Queries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(currentSession.accuracy * 100)}%
                </div>
                <div className="text-sm text-gray-500">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((Date.now() - currentSession.startTime.getTime()) / 60000)}m
                </div>
                <div className="text-sm text-gray-500">Duration</div>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="text-sm">
                  {currentSession.language === 'hi' ? 'हिंदी' : 'English'}
                </Badge>
                <div className="text-sm text-gray-500">Language</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voice Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Main Voice Button */}
            <Button
              onClick={isListening ? stopListening : startListening}
              size="lg"
              className={`h-20 w-20 rounded-full ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>

            {/* Status */}
            <div className="text-center">
              <Badge
                variant={isListening ? "default" : "secondary"}
                className="mb-2"
              >
                {isListening ? "Listening..." : "Click to speak"}
              </Badge>
              {confidence > 0 && (
                <div className="text-sm text-gray-500">
                  Confidence: {Math.round(confidence * 100)}%
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {isSpeaking && (
                <Button onClick={stopSpeaking} variant="outline" size="sm">
                  <VolumeX className="h-4 w-4 mr-2" />
                  Stop Speaking
                </Button>
              )}

              <Button
                onClick={() => setTranscript('')}
                variant="outline"
                size="sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>

            {/* Current Transcript */}
            {transcript && (
              <Alert className="w-full max-w-2xl">
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  <strong>You said:</strong> "{transcript}"
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Voice Commands & History Tabs */}
      <Tabs defaultValue="commands" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="commands">Voice Commands</TabsTrigger>
          <TabsTrigger value="history">Query History</TabsTrigger>
        </TabsList>

        <TabsContent value="commands" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Voice Commands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {voiceCommands.map((command, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      command.category === 'financial' ? 'border-blue-500 bg-blue-50' :
                      command.category === 'kpi' ? 'border-green-500 bg-green-50' :
                      command.category === 'environmental' ? 'border-purple-500 bg-purple-50' :
                      'border-orange-500 bg-orange-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {command.category === 'financial' && <DollarSign className="h-5 w-5 text-blue-600" />}
                      {command.category === 'kpi' && <TrendingUp className="h-5 w-5 text-green-600" />}
                      {command.category === 'environmental' && <Leaf className="h-5 w-5 text-purple-600" />}
                      {command.category === 'strategic' && <Users className="h-5 w-5 text-orange-600" />}
                      <h4 className="font-medium text-gray-900">{command.command}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{command.description}</p>
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-gray-500">Examples:</div>
                      {command.examples.slice(0, 2).map((example, idx) => (
                        <div key={idx} className="text-xs text-gray-600">
                          • "{example}"
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Voice Queries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {queryHistory.length > 0 ? (
                <div className="space-y-3">
                  {queryHistory.map((query) => (
                    <div key={query.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-sm font-medium text-gray-900">
                          "{query.query}"
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {Math.round(query.confidence * 100)}%
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {query.language === 'hi' ? 'हिंदी' : 'English'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Response:</strong> {query.response}
                      </div>
                      <div className="text-xs text-gray-500">
                        {query.timestamp.toLocaleTimeString()} • Category: {query.category}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No voice queries yet. Start speaking to see your history here.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VoiceAnalytics;