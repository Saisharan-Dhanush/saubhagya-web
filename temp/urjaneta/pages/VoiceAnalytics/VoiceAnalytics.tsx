import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, BarChart3, TrendingUp, DollarSign, Zap, History, Languages } from 'lucide-react';

interface VoiceQuery {
  id: string;
  query: string;
  language: 'en' | 'hi';
  timestamp: string;
  response: AnalyticsResult;
}

interface AnalyticsResult {
  type: 'metric' | 'chart' | 'list';
  title: string;
  value?: string;
  data?: any[];
  insights?: string[];
}

const VoiceAnalytics: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [results, setResults] = useState<AnalyticsResult | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  
  const [queryHistory] = useState<VoiceQuery[]>([
    {
      id: '1',
      query: 'Show me today\'s CBG production',
      language: 'en',
      timestamp: '2 minutes ago',
      response: {
        type: 'metric',
        title: 'Today\'s CBG Production',
        value: '2,450 m³',
        insights: ['Production up 12% from yesterday', 'All units operational']
      }
    },
    {
      id: '2',
      query: 'आज का राजस्व कितना है?',
      language: 'hi',
      timestamp: '5 minutes ago',
      response: {
        type: 'metric',
        title: 'Today\'s Revenue',
        value: '₹2.8L',
        insights: ['Revenue trending +15% this week', 'Carbon credits contributed 18%']
      }
    },
    {
      id: '3',
      query: 'Which cluster has highest efficiency?',
      language: 'en',
      timestamp: '10 minutes ago',
      response: {
        type: 'list',
        title: 'Cluster Efficiency Rankings',
        data: [
          { name: 'Mathura Cluster', efficiency: '98.5%' },
          { name: 'Vrindavan Cluster', efficiency: '95.2%' },
          { name: 'Goverdhan Cluster', efficiency: '87.8%' }
        ]
      }
    }
  ]);

  const exampleQueries = {
    en: [
      "What's today's CBG production?",
      "Show revenue last quarter",
      "Which cluster has highest efficiency?",
      "Predict next month's production",
      "Show carbon credits generated",
      "Revenue trend last 6 months"
    ],
    hi: [
      "आज का सीबीजी उत्पादन कितना है?",
      "पिछली तिमाही का राजस्व दिखाएं",
      "कौन सा क्लस्टर सबसे अधिक कुशल है?",
      "अगले महीने के उत्पादन का पूर्वानुमान",
      "कार्बन क्रेडिट दिखाएं",
      "पिछले 6 महीने का राजस्व ट्रेंड"
    ]
  };

  const processVoiceQuery = (text: string) => {
    // Mock NLP processing
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('production') || lowerText.includes('उत्पादन')) {
      return {
        type: 'metric' as const,
        title: 'Today\'s CBG Production',
        value: '2,450 m³',
        insights: ['Production up 12% from yesterday', 'All units operational', 'Peak efficiency at 2 PM']
      };
    }
    
    if (lowerText.includes('revenue') || lowerText.includes('राजस्व')) {
      return {
        type: 'metric' as const,
        title: 'Revenue Analysis',
        value: '₹8.2L',
        insights: ['Monthly revenue +15.3%', 'CBG sales: ₹6.8L', 'Carbon credits: ₹1.2L']
      };
    }
    
    if (lowerText.includes('cluster') || lowerText.includes('क्लस्टर')) {
      return {
        type: 'list' as const,
        title: 'Cluster Performance Rankings',
        data: [
          { name: 'Mathura Cluster', efficiency: '98.5%', production: '850 m³' },
          { name: 'Vrindavan Cluster', efficiency: '95.2%', production: '780 m³' },
          { name: 'Goverdhan Cluster', efficiency: '87.8%', production: '820 m³' }
        ]
      };
    }
    
    if (lowerText.includes('carbon') || lowerText.includes('कार्बन')) {
      return {
        type: 'metric' as const,
        title: 'Carbon Credits Generated',
        value: '145.5 tCO2e',
        insights: ['Monthly target achieved', 'Market value: ₹1.19L', 'Verification pending: 12 credits']
      };
    }
    
    // Default response
    return {
      type: 'metric' as const,
      title: 'Business Overview',
      value: 'All Systems Operational',
      insights: ['Production: 2,450 m³', 'Revenue: ₹8.2L', 'Efficiency: 89.2%']
    };
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    setCurrentQuery('');
    
    // Mock voice recognition
    setTimeout(() => {
      const mockQueries = exampleQueries[language];
      const randomQuery = mockQueries[Math.floor(Math.random() * mockQueries.length)];
      setCurrentQuery(randomQuery);
      
      setTimeout(() => {
        const result = processVoiceQuery(randomQuery);
        setResults(result);
        setIsListening(false);
      }, 1000);
    }, 2000);
  };

  const handleExampleQuery = (query: string) => {
    setCurrentQuery(query);
    const result = processVoiceQuery(query);
    setResults(result);
  };

  const renderResults = () => {
    if (!results) return null;

    switch (results.type) {
      case 'metric':
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {results.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">{results.value}</div>
              {results.insights && (
                <div className="space-y-2">
                  {results.insights.map((insight, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      
      case 'list':
        return (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {results.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.data?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex gap-4">
                      <Badge className="bg-green-500">{item.efficiency}</Badge>
                      {item.production && (
                        <span className="text-sm text-muted-foreground">{item.production}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Voice Analytics</h1>
          <p className="text-muted-foreground">
            Ask questions about your business in natural language
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-2"
          >
            <Languages className="h-4 w-4" />
            {language === 'en' ? 'English' : 'हिंदी'}
          </Button>
        </div>
      </div>

      <div className="text-center">
        <div className="inline-flex flex-col items-center gap-4 p-8">
          <button
            onClick={handleVoiceInput}
            disabled={isListening}
            className={`p-12 rounded-full transition-all duration-300 shadow-lg ${
              isListening 
                ? 'bg-red-500 animate-pulse scale-110' 
                : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
            } text-white`}
          >
            {isListening ? (
              <MicOff className="w-16 h-16" />
            ) : (
              <Mic className="w-16 h-16" />
            )}
          </button>
          
          <div className="text-center">
            <p className="text-lg font-medium">
              {isListening 
                ? (language === 'en' ? 'Listening...' : 'सुन रहा हूं...')
                : (language === 'en' ? 'Ask me anything about your business' : 'अपने व्यवसाय के बारे में कुछ भी पूछें')
              }
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'en' 
                ? 'Speak clearly for best results'
                : 'सर्वोत्तम परिणामों के लिए स्पष्ट रूप से बोलें'
              }
            </p>
          </div>
        </div>
      </div>

      {currentQuery && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-blue-600" />
              <p className="text-lg font-medium text-blue-800">"</p>
              <p className="text-lg text-blue-800">{currentQuery}</p>
              <p className="text-lg font-medium text-blue-800">"</p>
            </div>
          </CardContent>
        </Card>
      )}

      {renderResults()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              {language === 'en' ? 'Example Questions' : 'उदाहरण प्रश्न'}
            </CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'Try these sample queries to get started'
                : 'शुरुआत करने के लिए इन नमूना प्रश्नों को आज़माएं'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exampleQueries[language].map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleQuery(query)}
                  className="w-full text-left p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <p className="text-sm">{query}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              {language === 'en' ? 'Recent Queries' : 'हाल की क्वेरीज़'}
            </CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'Your recent voice interactions'
                : 'आपकी हाल की आवाज़ बातचीत'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {queryHistory.map((query) => (
                <div key={query.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">
                      {query.language === 'en' ? 'English' : 'हिंदी'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{query.timestamp}</span>
                  </div>
                  <p className="text-sm font-medium mb-1">{query.query}</p>
                  <p className="text-xs text-muted-foreground">
                    Result: {query.response.title}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceAnalytics;
export { VoiceAnalytics };