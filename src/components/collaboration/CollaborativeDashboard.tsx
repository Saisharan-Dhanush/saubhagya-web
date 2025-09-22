import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCollaboration } from '../../contexts/CollaborationContext'
import { useAuth } from '../../contexts/AuthContext'
import {
  Users,
  MessageSquare,
  Share,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Phone,
  PhoneOff,
  Settings,
  Bell,
  Clock,
  Eye,
  Edit,
  Send,
  UserPlus,
  Folder
} from 'lucide-react'

interface CollaborativeDashboardProps {
  className?: string
}

export const CollaborativeDashboard: React.FC<CollaborativeDashboardProps> = ({
  className = ''
}) => {
  const { user } = useAuth()
  const {
    activeUsers,
    activeSessions,
    currentSession,
    workspaces,
    currentWorkspace,
    messages,
    notifications,
    startSession,
    joinSession,
    leaveSession,
    sendMessage,
    switchWorkspace
  } = useCollaboration()

  const [messageInput, setMessageInput] = useState('')
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [showSessionDialog, setShowSessionDialog] = useState(false)
  const [sessionName, setSessionName] = useState('')

  // Auto-scroll messages
  useEffect(() => {
    const messageContainer = document.getElementById('collaboration-messages')
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      await sendMessage(messageInput)
      setMessageInput('')
    }
  }

  const handleStartSession = async () => {
    if (sessionName.trim()) {
      await startSession(sessionName, ['urjasanyojak', 'shuddhi-doot', 'urja-vyapar'])
      setSessionName('')
      setShowSessionDialog(false)
    }
  }

  const getPresenceIndicator = (isActive: boolean, lastSeen: Date) => {
    if (isActive) return 'bg-green-500'
    const minutesAgo = Math.floor((Date.now() - lastSeen.getTime()) / (1000 * 60))
    if (minutesAgo < 5) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const formatLastSeen = (lastSeen: Date, isActive: boolean) => {
    if (isActive) return 'Active now'
    const minutesAgo = Math.floor((Date.now() - lastSeen.getTime()) / (1000 * 60))
    if (minutesAgo < 1) return 'Just now'
    if (minutesAgo < 60) return `${minutesAgo}m ago`
    const hoursAgo = Math.floor(minutesAgo / 60)
    return `${hoursAgo}h ago`
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Active Users */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Users ({activeUsers.filter(u => u.isActive).length})
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSessionDialog(true)}
            >
              <Video className="h-4 w-4 mr-2" />
              Start Session
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeUsers.map((collaborationUser) => (
              <div key={collaborationUser.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-800">
                        {collaborationUser.name.charAt(0)}
                      </span>
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getPresenceIndicator(collaborationUser.isActive, collaborationUser.lastSeen)}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{collaborationUser.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatLastSeen(collaborationUser.lastSeen, collaborationUser.isActive)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {collaborationUser.currentModule && (
                    <Badge variant="outline" className="text-xs">
                      {collaborationUser.currentModule}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {collaborationUser.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Workspace */}
      {currentWorkspace && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Current Workspace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">{currentWorkspace.name}</h3>
                <p className="text-sm text-gray-600">{currentWorkspace.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Members:</span>
                  <Badge variant="outline">{currentWorkspace.members.length}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Modules:</span>
                  <Badge variant="outline">{currentWorkspace.modules.length}</Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Active Sessions ({activeSessions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{session.name}</h3>
                    <Badge
                      variant={session.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {session.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{session.participants.length} participants</span>
                    </div>
                    <div className="flex space-x-2">
                      {currentSession?.id === session.id ? (
                        <Button variant="destructive" size="sm" onClick={leaveSession}>
                          <PhoneOff className="h-4 w-4 mr-2" />
                          Leave
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => joinSession(session.id)}>
                          <Phone className="h-4 w-4 mr-2" />
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Session Controls */}
      {currentSession && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Session: {currentSession.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Video Controls */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Session Controls</span>
                <Badge variant="outline">{currentSession.participants.length} active</Badge>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={isAudioEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                >
                  {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant={isVideoEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                >
                  {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div>
              <div
                id="collaboration-messages"
                className="h-48 overflow-y-auto border rounded-lg p-3 space-y-2 bg-gray-50"
              >
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-blue-800">
                          {message.userName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {message.userName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button size="sm" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Creation Dialog */}
      {showSessionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Start New Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Session name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowSessionDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStartSession}>Start Session</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default CollaborativeDashboard