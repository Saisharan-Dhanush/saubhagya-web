import React, { useState, useEffect } from 'react';
import { Mic, Volume2, Brain, TrendingUp, BarChart3, Zap, AlertTriangle } from 'lucide-react';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { useExecutiveAnalytics } from '../../hooks/useExecutiveAnalytics';

interface ExecutiveVoiceCommandsProps {
  onCommandResult?: (result: any) => void;
  className?: string;
}

interface VoiceAnalyticsResponse {
  intent: string;
  entities: Record<string, any>;
  data: any;
  visualizations?: Array<{
    type: 'chart' | 'table' | 'metric';
    config: any;
  }>;
  recommendations?: string[];
}

export default function ExecutiveVoiceCommands({ onCommandResult, className = '' }: ExecutiveVoiceCommandsProps) {
  const {
    isListening,
    transcript,
    confidence,
    isProcessing,
    lastResponse,
    language,
    isSpeaking,
    startListening,
    stopListening,
    speakResponse
  } = useVoiceRecognition();

  const {
    kpis,
    predictiveAnalytics,
    competitiveIntelligence,
    insights,
    calculatedAnalytics
  } = useExecutiveAnalytics();

  const [executiveResponse, setExecutiveResponse] = useState<VoiceAnalyticsResponse | null>(null);
  const [commandHistory, setCommandHistory] = useState<Array<{
    command: string;
    response: string;
    timestamp: Date;
    intent: string;
  }>>([]);
  const [quickCommands, setQuickCommands] = useState<string[]>([]);

  // Executive-specific voice commands
  const executiveCommands = {
    en: [
      "What's our quarterly revenue growth?",
      "Show me top performing KPIs",
      "What are our carbon credit projections?",
      "How do we compare to competitors?",
      "What strategic risks should I know about?",
      "Give me the executive summary",
      "What's our market position?",
      "Show predictive analytics for next quarter",
      "What optimization opportunities do we have?",
      "What are the latest performance alerts?"
    ],
    hi: [
      "हमारी तिमाही राजस्व वृद्धि क्या है?",
      "टॉप परफॉर्मिंग KPIs दिखाएं",
      "कार्बन क्रेडिट के अनुमान क्या हैं?",
      "प्रतिस्पर्धियों से हमारी तुलना कैसी है?",
      "मुझे कौन से रणनीतिक जोखिम पता होने चाहिए?",
      "कार्यकारी सारांश दें",
      "हमारी बाज़ार स्थिति क्या है?",
      "अगली तिमाही के लिए भविष्यवाणी विश्लेषण दिखाएं",
      "हमारे पास क्या अनुकूलन अवसर हैं?",
      "नवीनतम प्रदर्शन अलर्ट क्या हैं?"
    ]
  };

  useEffect(() => {
    setQuickCommands(executiveCommands[language]);
  }, [language]);

  // Process executive voice commands
  const processExecutiveCommand = async (command: string) => {
    const intent = await analyzeIntent(command);
    let response: VoiceAnalyticsResponse | null = null;

    switch (intent) {
      case 'revenue_analysis':
        response = await handleRevenueAnalysis();
        break;
      case 'kpi_summary':
        response = await handleKPISummary();
        break;
      case 'competitive_analysis':
        response = await handleCompetitiveAnalysis();
        break;
      case 'predictive_analytics':
        response = await handlePredictiveAnalytics();
        break;
      case 'risk_assessment':
        response = await handleRiskAssessment();
        break;
      case 'executive_summary':
        response = await handleExecutiveSummary();
        break;
      case 'market_position':
        response = await handleMarketPosition();
        break;
      case 'carbon_projections':
        response = await handleCarbonProjections();
        break;
      case 'optimization_opportunities':
        response = await handleOptimizationOpportunities();
        break;
      case 'performance_alerts':
        response = await handlePerformanceAlerts();
        break;
      default:
        response = await handleGeneralQuery(command);
    }

    if (response) {
      setExecutiveResponse(response);
      setCommandHistory(prev => [{
        command,
        response: response.data?.summary || 'Response generated',
        timestamp: new Date(),
        intent
      }, ...prev.slice(0, 9)]);

      if (onCommandResult) {
        onCommandResult(response);
      }
    }
  };

  // Intent analysis
  const analyzeIntent = async (command: string): Promise<string> => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('revenue') || lowerCommand.includes('sales') || lowerCommand.includes('राजस्व')) {
      return 'revenue_analysis';
    }
    if (lowerCommand.includes('kpi') || lowerCommand.includes('performance') || lowerCommand.includes('प्रदर्शन')) {
      return 'kpi_summary';
    }
    if (lowerCommand.includes('competitor') || lowerCommand.includes('market share') || lowerCommand.includes('प्रतिस्पर्धी')) {
      return 'competitive_analysis';
    }
    if (lowerCommand.includes('predict') || lowerCommand.includes('forecast') || lowerCommand.includes('भविष्यवाणी')) {
      return 'predictive_analytics';
    }
    if (lowerCommand.includes('risk') || lowerCommand.includes('threat') || lowerCommand.includes('जोखिम')) {
      return 'risk_assessment';
    }
    if (lowerCommand.includes('summary') || lowerCommand.includes('overview') || lowerCommand.includes('सारांश')) {
      return 'executive_summary';
    }
    if (lowerCommand.includes('market position') || lowerCommand.includes('ranking') || lowerCommand.includes('बाज़ार स्थिति')) {
      return 'market_position';
    }
    if (lowerCommand.includes('carbon') || lowerCommand.includes('environmental') || lowerCommand.includes('कार्बन')) {
      return 'carbon_projections';
    }
    if (lowerCommand.includes('optimize') || lowerCommand.includes('improve') || lowerCommand.includes('अनुकूलन')) {
      return 'optimization_opportunities';
    }
    if (lowerCommand.includes('alert') || lowerCommand.includes('notification') || lowerCommand.includes('अलर्ट')) {
      return 'performance_alerts';
    }

    return 'general_query';
  };

  // Command handlers
  const handleRevenueAnalysis = async (): Promise<VoiceAnalyticsResponse> => {
    const revenueKPI = kpis.find(kpi => kpi.id === 'revenue');
    const currentRevenue = revenueKPI?.value || 0;
    const growth = revenueKPI?.change || 0;
    const predicted = predictiveAnalytics.revenue.predicted12Month;

    return {
      intent: 'revenue_analysis',
      entities: { metric: 'revenue', timeframe: 'quarterly' },
      data: {
        current: currentRevenue,
        growth: growth,
        predicted: predicted,
        summary: language === 'hi'
          ? `वर्तमान राजस्व ₹${(currentRevenue/100000).toFixed(1)} लाख है ${growth > 0 ? 'जो' : 'लेकिन'} ${Math.abs(growth).toFixed(1)}% ${growth > 0 ? 'वृद्धि' : 'गिरावट'} दर्शा रहा है। अगले साल का अनुमान ₹${(predicted/100000).toFixed(1)} लाख है।`
          : `Current revenue is ₹${(currentRevenue/100000).toFixed(1)} lakh with ${growth.toFixed(1)}% ${growth > 0 ? 'growth' : 'decline'}. Next year projection is ₹${(predicted/100000).toFixed(1)} lakh.`
      },
      visualizations: [{
        type: 'chart',
        config: { type: 'line', metric: 'revenue', timespan: '12m' }
      }],
      recommendations: [
        language === 'hi' ? 'राजस्व वृद्धि के लिए नए बाज़ार खंडों में विस्तार करें' : 'Expand into new market segments for revenue growth',
        language === 'hi' ? 'कार्बन क्रेडिट राजस्व अनुकूलन पर ध्यान दें' : 'Focus on carbon credit revenue optimization'
      ]
    };
  };

  const handleKPISummary = async (): Promise<VoiceAnalyticsResponse> => {
    const topKPIs = kpis
      .sort((a, b) => b.change - a.change)
      .slice(0, 3);

    const summary = language === 'hi'
      ? `शीर्ष प्रदर्शनकारी KPIs: ${topKPIs.map(kpi => `${kpi.name} ${kpi.change > 0 ? '+' : ''}${kpi.change.toFixed(1)}%`).join(', ')}। समग्र प्रदर्शन ${calculatedAnalytics?.performanceScore.overall.toFixed(1)}% है।`
      : `Top performing KPIs: ${topKPIs.map(kpi => `${kpi.name} ${kpi.change > 0 ? '+' : ''}${kpi.change.toFixed(1)}%`).join(', ')}. Overall performance is ${calculatedAnalytics?.performanceScore.overall.toFixed(1)}%.`;

    return {
      intent: 'kpi_summary',
      entities: { scope: 'top_performers', count: 3 },
      data: {
        topKPIs,
        overallScore: calculatedAnalytics?.performanceScore.overall,
        summary
      },
      visualizations: [{
        type: 'chart',
        config: { type: 'bar', metrics: topKPIs.map(kpi => kpi.id) }
      }]
    };
  };

  const handleCompetitiveAnalysis = async (): Promise<VoiceAnalyticsResponse> => {
    const marketShare = competitiveIntelligence.marketPosition.marketShare;
    const rank = competitiveIntelligence.marketPosition.rank;
    const topCompetitor = competitiveIntelligence.marketPosition.competitors[0];

    const summary = language === 'hi'
      ? `हम बाज़ार में ${rank} नंबर पर हैं ${marketShare.toFixed(1)}% हिस्सेदारी के साथ। ${topCompetitor.name} अग्रणी है ${topCompetitor.marketShare.toFixed(1)}% के साथ। हमारे मुख्य फायदे हैं: ${competitiveIntelligence.competitiveAdvantages.slice(0, 2).map(adv => adv.advantage).join(', ')}।`
      : `We rank #${rank} in the market with ${marketShare.toFixed(1)}% share. ${topCompetitor.name} leads with ${topCompetitor.marketShare.toFixed(1)}%. Our key advantages: ${competitiveIntelligence.competitiveAdvantages.slice(0, 2).map(adv => adv.advantage).join(', ')}.`;

    return {
      intent: 'competitive_analysis',
      entities: { scope: 'market_position', competitors: true },
      data: {
        marketShare,
        rank,
        competitors: competitiveIntelligence.marketPosition.competitors,
        advantages: competitiveIntelligence.competitiveAdvantages,
        summary
      },
      visualizations: [{
        type: 'chart',
        config: { type: 'pie', metric: 'market_share' }
      }],
      recommendations: competitiveIntelligence.swotAnalysis.opportunities.slice(0, 2)
    };
  };

  const handlePredictiveAnalytics = async (): Promise<VoiceAnalyticsResponse> => {
    const nextQuarterRevenue = predictiveAnalytics.revenue.predicted6Month;
    const confidence = predictiveAnalytics.revenue.confidence;
    const growthRate = predictiveAnalytics.revenue.growthRate;

    const summary = language === 'hi'
      ? `अगली तिमाही का राजस्व अनुमान ₹${(nextQuarterRevenue/100000).toFixed(1)} लाख है ${confidence}% विश्वसनीयता के साथ। वार्षिक वृद्धि दर ${growthRate.toFixed(1)}% अपेक्षित है।`
      : `Next quarter revenue prediction is ₹${(nextQuarterRevenue/100000).toFixed(1)} lakh with ${confidence}% confidence. Annual growth rate expected at ${growthRate.toFixed(1)}%.`;

    return {
      intent: 'predictive_analytics',
      entities: { timeframe: 'next_quarter', confidence: confidence },
      data: {
        prediction: nextQuarterRevenue,
        confidence,
        growthRate,
        scenarios: predictiveAnalytics.revenue.scenarios,
        summary
      },
      visualizations: [{
        type: 'chart',
        config: { type: 'forecast', timespan: '6m' }
      }]
    };
  };

  const handleRiskAssessment = async (): Promise<VoiceAnalyticsResponse> => {
    const riskLevel = calculatedAnalytics?.riskAssessment.level || 'medium';
    const factors = calculatedAnalytics?.riskAssessment.factors || [];
    const threats = competitiveIntelligence.swotAnalysis.threats;

    const summary = language === 'hi'
      ? `जोखिम स्तर: ${riskLevel === 'high' ? 'उच्च' : riskLevel === 'medium' ? 'मध्यम' : 'कम'}। मुख्य चिंताएं: ${factors.slice(0, 2).join(', ')}। बाहरी खतरे: ${threats.slice(0, 2).join(', ')}।`
      : `Risk level: ${riskLevel}. Main concerns: ${factors.slice(0, 2).join(', ')}. External threats: ${threats.slice(0, 2).join(', ')}.`;

    return {
      intent: 'risk_assessment',
      entities: { level: riskLevel, scope: 'comprehensive' },
      data: {
        riskLevel,
        internalFactors: factors,
        externalThreats: threats,
        mitigation: calculatedAnalytics?.riskAssessment.mitigation || [],
        summary
      },
      recommendations: calculatedAnalytics?.riskAssessment.mitigation || []
    };
  };

  const handleExecutiveSummary = async (): Promise<VoiceAnalyticsResponse> => {
    const overallScore = calculatedAnalytics?.performanceScore.overall || 0;
    const topConcerns = insights?.concerns || [];
    const keyFindings = insights?.keyFindings || [];

    const summary = language === 'hi'
      ? `कार्यकारी सारांश: समग्र प्रदर्शन ${overallScore.toFixed(1)}%। मुख्य निष्कर्ष: ${keyFindings.slice(0, 2).join(', ')}। तत्काल ध्यान आवश्यक: ${topConcerns.slice(0, 2).join(', ')}।`
      : `Executive Summary: Overall performance ${overallScore.toFixed(1)}%. Key findings: ${keyFindings.slice(0, 2).join(', ')}. Immediate attention needed: ${topConcerns.slice(0, 2).join(', ')}.`;

    return {
      intent: 'executive_summary',
      entities: { scope: 'comprehensive', priority: 'high' },
      data: {
        overallScore,
        keyFindings,
        concerns: topConcerns,
        opportunities: insights?.opportunities || [],
        actionItems: insights?.actionItems || [],
        summary
      },
      visualizations: [{
        type: 'chart',
        config: { type: 'dashboard', scope: 'executive' }
      }]
    };
  };

  const handleMarketPosition = async (): Promise<VoiceAnalyticsResponse> => {
    const position = competitiveIntelligence.marketPosition;
    const summary = language === 'hi'
      ? `बाज़ार स्थिति: ${position.rank} स्थान पर ${position.marketShare.toFixed(1)}% हिस्सेदारी के साथ। प्रमुख प्रतिस्पर्धी ${position.competitors[0].name} का ${position.competitors[0].marketShare.toFixed(1)}% है।`
      : `Market position: Rank #${position.rank} with ${position.marketShare.toFixed(1)}% share. Leading competitor ${position.competitors[0].name} has ${position.competitors[0].marketShare.toFixed(1)}%.`;

    return {
      intent: 'market_position',
      entities: { metric: 'market_share', comparison: true },
      data: {
        ...position,
        summary
      }
    };
  };

  const handleCarbonProjections = async (): Promise<VoiceAnalyticsResponse> => {
    const current = predictiveAnalytics.carbonCredits.current;
    const projected = predictiveAnalytics.carbonCredits.projected;
    const revenue = predictiveAnalytics.carbonCredits.revenue;

    const summary = language === 'hi'
      ? `कार्बन क्रेडिट: वर्तमान ${current} टन, अनुमानित ${projected} टन। राजस्व ₹${(revenue/100000).toFixed(1)} लाख। बाज़ार रुझान ${predictiveAnalytics.carbonCredits.trend === 'bullish' ? 'तेजी' : 'मंदी'}।`
      : `Carbon credits: Current ${current} tons, projected ${projected} tons. Revenue ₹${(revenue/100000).toFixed(1)} lakh. Market trend is ${predictiveAnalytics.carbonCredits.trend}.`;

    return {
      intent: 'carbon_projections',
      entities: { metric: 'carbon_credits', timeframe: 'projection' },
      data: {
        current,
        projected,
        revenue,
        trend: predictiveAnalytics.carbonCredits.trend,
        summary
      }
    };
  };

  const handleOptimizationOpportunities = async (): Promise<VoiceAnalyticsResponse> => {
    const recommendations = calculatedAnalytics?.recommendations || [];
    const opportunities = insights?.opportunities || [];

    const summary = language === 'hi'
      ? `अनुकूलन अवसर: ${recommendations.slice(0, 2).map(rec => rec.action).join(', ')}। बाज़ार अवसर: ${opportunities.slice(0, 2).join(', ')}।`
      : `Optimization opportunities: ${recommendations.slice(0, 2).map(rec => rec.action).join(', ')}. Market opportunities: ${opportunities.slice(0, 2).join(', ')}.`;

    return {
      intent: 'optimization_opportunities',
      entities: { scope: 'strategic', priority: 'actionable' },
      data: {
        recommendations,
        opportunities,
        summary
      }
    };
  };

  const handlePerformanceAlerts = async (): Promise<VoiceAnalyticsResponse> => {
    // This would typically come from the alerts system
    const criticalAlerts = ['Customer satisfaction declining', 'Production efficiency below target'];

    const summary = language === 'hi'
      ? `प्रदर्शन अलर्ट: ${criticalAlerts.join(', ')}। तत्काल कार्य आवश्यक।`
      : `Performance alerts: ${criticalAlerts.join(', ')}. Immediate action required.`;

    return {
      intent: 'performance_alerts',
      entities: { urgency: 'high', category: 'performance' },
      data: {
        alerts: criticalAlerts,
        summary
      }
    };
  };

  const handleGeneralQuery = async (command: string): Promise<VoiceAnalyticsResponse> => {
    const summary = language === 'hi'
      ? 'मैं इस क्वेरी को समझने की कोशिश कर रहा हूं। कृपया अधिक विशिष्ट प्रश्न पूछें।'
      : 'I\'m trying to understand this query. Please ask a more specific question.';

    return {
      intent: 'general_query',
      entities: {},
      data: { summary }
    };
  };

  const handleQuickCommand = async (command: string) => {
    await speakResponse(command);
    await processExecutiveCommand(command);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Executive Voice Interface */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8" />
            <div>
              <h3 className="text-xl font-bold">
                {language === 'hi' ? 'कार्यकारी वॉइस एनालिटिक्स' : 'Executive Voice Analytics'}
              </h3>
              <p className="text-blue-100">
                {language === 'hi' ? 'उन्नत व्यावसायिक बुद्धिमत्ता के लिए आवाज का उपयोग करें' : 'Use voice for advanced business intelligence'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isListening ? 'bg-red-500' : isProcessing ? 'bg-yellow-500' : 'bg-green-500'
            }`}>
              {isProcessing ? (language === 'hi' ? 'विश्लेषण' : 'Analyzing') :
               isListening ? (language === 'hi' ? 'सुन रहा' : 'Listening') :
               (language === 'hi' ? 'तैयार' : 'Ready')}
            </div>

            <button
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-full transition-colors ${
                isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <Mic className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Voice Status */}
        {transcript && (
          <div className="bg-white/10 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Mic className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium mb-1">
                  {language === 'hi' ? 'आपका प्रश्न:' : 'Your Query:'}
                </p>
                <p className="text-blue-100">{transcript}</p>
                <p className="text-xs text-blue-200 mt-1">
                  Confidence: {confidence.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="bg-white/10 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <p>{language === 'hi' ? 'विश्लेषण हो रहा है...' : 'Analyzing your request...'}</p>
            </div>
          </div>
        )}

        {/* Executive Response */}
        {executiveResponse && (
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Volume2 className={`h-5 w-5 mt-0.5 ${isSpeaking ? 'animate-pulse' : ''}`} />
              <div className="flex-1">
                <p className="font-medium mb-1">
                  {language === 'hi' ? 'विश्लेषण परिणाम:' : 'Analysis Result:'}
                </p>
                <p className="text-blue-100 mb-3">{executiveResponse.data.summary}</p>

                {executiveResponse.recommendations && executiveResponse.recommendations.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium text-sm mb-2">
                      {language === 'hi' ? 'सिफारिशें:' : 'Recommendations:'}
                    </p>
                    <ul className="text-sm text-blue-100 space-y-1">
                      {executiveResponse.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-300">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Executive Commands */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'hi' ? 'त्वरित कार्यकारी कमांड' : 'Quick Executive Commands'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickCommands.map((command, index) => (
            <button
              key={index}
              onClick={() => handleQuickCommand(command)}
              className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200">
                  {index < 3 ? <TrendingUp className="h-4 w-4 text-blue-600" /> :
                   index < 6 ? <BarChart3 className="h-4 w-4 text-blue-600" /> :
                   <Zap className="h-4 w-4 text-blue-600" />}
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{command}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Command History */}
      {commandHistory.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'hi' ? 'कमांड इतिहास' : 'Command History'}
          </h4>

          <div className="space-y-3">
            {commandHistory.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.command}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.intent} • {item.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}