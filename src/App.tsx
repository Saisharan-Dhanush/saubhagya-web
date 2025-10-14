import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { PlatformProvider } from './contexts/PlatformContext'
import { Toaster } from 'sonner'
import Login from './pages/Login'
import AdminModule from './modules/admin/Admin.container'
import Admin from './pages/Admin'
import UrjaSanyojak from './pages/UrjaSanyojak'
import Dashboard from './pages/Dashboard'
import ExecutiveDashboard from './pages/ExecutiveDashboard'
import GauShala from './pages/GauShala'
import BiogasSangh from './pages/BiogasSangh'
import { SalesModule } from './modules/sales'
import { PurificationModule } from './modules/purification'
import UrjaNeta from './pages/UrjaNeta'
import TransporterModule from './modules/transporter'
import RoleBasedRouter from './components/routing/RoleBasedRouter'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  console.log('🔒 [PrivateRoute] Check -', {
    user: user ? `${user.name} (${user.role})` : 'null',
    loading,
    willRedirect: !user && !loading
  })

  if (loading) {
    console.log('⏳ [PrivateRoute] Still loading, showing spinner')
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    console.log('🚫 [PrivateRoute] No user found, redirecting to /login')
  }

  return user ? <>{children}</> : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <PrivateRoute>
          <RoleBasedRouter />
        </PrivateRoute>
      } />
      <Route path="/admin/*" element={
        <PrivateRoute>
          <AdminModule />
        </PrivateRoute>
      } />
      <Route path="/gaushala/*" element={
        <PrivateRoute>
          <GauShala />
        </PrivateRoute>
      } />
      <Route path="/cluster/*" element={
        <PrivateRoute>
          <BiogasSangh />
        </PrivateRoute>
      } />
      <Route path="/sales/*" element={
        <PrivateRoute>
          <SalesModule />
        </PrivateRoute>
      } />
      <Route path="/purification/*" element={
        <PrivateRoute>
          <PurificationModule />
        </PrivateRoute>
      } />
      <Route path="/urjaneta/*" element={
        <PrivateRoute>
          <UrjaNeta />
        </PrivateRoute>
      } />
      <Route path="/urjasanyojak/*" element={
        <PrivateRoute>
          <UrjaSanyojak />
        </PrivateRoute>
      } />
      <Route path="/admin-dashboard/*" element={
        <PrivateRoute>
          <Admin />
        </PrivateRoute>
      } />
      <Route path="/dashboard/*" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/executive/*" element={
        <PrivateRoute>
          <ExecutiveDashboard />
        </PrivateRoute>
      } />
      <Route path="/transport/*" element={
        <PrivateRoute>
          <TransporterModule />
        </PrivateRoute>
      } />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <PlatformProvider>
        <Router>
          <AppRoutes />
          <Toaster position="top-right" richColors closeButton />
        </Router>
      </PlatformProvider>
    </AuthProvider>
  )
}

export default App