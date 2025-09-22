import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Play, Pause, Square, Languages, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { salesService } from '../services/salesService';
import { VoiceInvoiceData } from '../types';

const VoiceInvoicing: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');
  const [currentSession, setCurrentSession] = useState<VoiceInvoiceData | null>(null);
  const [transcription, setTranscription] = useState('');
  const [confidence, setConfidence] = useState(0);

  const startRecording = async () => {
    try {
      const response = await salesService.startVoiceSession(language);
      if (response.success) {
        setCurrentSession(response.data);
        setIsRecording(true);
        // Mock recording simulation
        setTimeout(() => {
          stopRecording();
        }, 5000);
      }
    } catch (error) {
      console.error('Error starting voice session:', error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (currentSession) {
      // Mock audio processing
      const response = await salesService.processVoiceData(currentSession.sessionId, 'mock-audio-data');
      if (response.success) {
        setCurrentSession(response.data);
        setTranscription(response.data.transcription);
        setConfidence(response.data.confidence * 100);
      }
    }
  };

  const generateInvoice = async () => {
    if (currentSession?.extractedData.customerId) {
      // Create order and generate invoice
      console.log('Generating invoice from voice data...');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Voice Invoicing</h1>
          <p className="text-gray-600">Create invoices using voice commands in Hindi or English</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice Recording Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mic className="w-5 h-5 mr-2" />
              Voice Input
            </CardTitle>
            <CardDescription>Record voice commands to create invoices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Language</label>
                <Select value={language} onValueChange={(value) => setLanguage(value as 'hindi' | 'english')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-center space-y-4">
                <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${isRecording ? 'bg-red-100 animate-pulse' : 'bg-gray-100'}`}>
                  {isRecording ? (
                    <MicOff className="w-16 h-16 text-red-600" />
                  ) : (
                    <Mic className="w-16 h-16 text-gray-600" />
                  )}
                </div>

                <div className="space-y-2">
                  {!isRecording ? (
                    <Button onClick={startRecording} className="w-full">
                      <Mic className="w-4 h-4 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} variant="destructive" className="w-full">
                      <Square className="w-4 h-4 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                </div>

                {isRecording && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Recording in progress...</div>
                    <Progress value={75} className="w-full" />
                  </div>
                )}
              </div>
            </div>

            {/* Sample Voice Commands */}
            <div className="space-y-3">
              <h4 className="font-medium">Sample Voice Commands:</h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-blue-50 rounded">
                  <strong>Hindi:</strong> "ग्रीन एनर्जी इंडस्ट्रीज के लिए एक हजार क्यूबिक मीटर बायो गैस, पैंतालीस रुपए प्रति यूनिट"
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <strong>English:</strong> "Create invoice for Green Energy Industries, one thousand cubic meters biogas at forty-five rupees per unit"
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transcription and Processing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Languages className="w-5 h-5 mr-2" />
              Transcription & Processing
            </CardTitle>
            <CardDescription>Voice-to-text conversion and data extraction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {transcription && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Transcription</label>
                  <Textarea value={transcription} readOnly className="mt-1" rows={3} />
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <Progress value={confidence} className="flex-1 max-w-32" />
                    <span className="text-sm font-medium">{confidence.toFixed(1)}%</span>
                  </div>
                </div>

                {currentSession?.extractedData && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Extracted Information:</h4>
                    <div className="space-y-2 text-sm">
                      {currentSession.extractedData.customerName && (
                        <div className="flex justify-between">
                          <span>Customer:</span>
                          <span className="font-medium">{currentSession.extractedData.customerName}</span>
                        </div>
                      )}
                      {currentSession.extractedData.items.map((item, index) => (
                        <div key={index} className="p-2 border rounded">
                          <div className="flex justify-between">
                            <span>Item:</span>
                            <span className="font-medium">{item.description}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Quantity:</span>
                            <span className="font-medium">{item.quantity} {item.unit}</span>
                          </div>
                          {item.pricePerUnit && (
                            <div className="flex justify-between">
                              <span>Price:</span>
                              <span className="font-medium">₹{item.pricePerUnit}/{item.unit}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      {currentSession.extractedData.totalAmount && (
                        <div className="flex justify-between font-semibold">
                          <span>Total Amount:</span>
                          <span>₹{currentSession.extractedData.totalAmount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {currentSession.validationErrors.length === 0 ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Data validation successful</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm">Validation errors found</span>
                        </div>
                        <ul className="text-sm text-red-600 space-y-1">
                          {currentSession.validationErrors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button onClick={generateInvoice} className="w-full" disabled={currentSession.validationErrors.length > 0}>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Invoice
                    </Button>
                  </div>
                )}
              </div>
            )}

            {!transcription && (
              <div className="text-center py-8 text-gray-500">
                Start recording to see transcription and extracted data
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Voice Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Voice Sessions</CardTitle>
          <CardDescription>History of voice invoicing sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">Session #001</div>
                <div className="text-sm text-gray-600">Green Energy Industries • ₹45,000 • Hindi</div>
                <div className="text-xs text-gray-500">2 minutes ago</div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4 mr-1" />
                  Replay
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceInvoicing;