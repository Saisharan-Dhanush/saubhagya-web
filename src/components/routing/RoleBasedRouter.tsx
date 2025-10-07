import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const RoleBasedRouter: React.FC = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Don't redirect if we're still loading or if user is not logged in
    if (loading || !user) return

    // Don't redirect if we're already on login page or other specific pages
    if (location.pathname === '/login' ||
        location.pathname === '/admin' ||
        location.pathname === '/testing' ||
        location.pathname === '/database-setup') {
      return
    }

    // Role-based routing logic
    const getDefaultRouteForUser = () => {
      // For executives and senior leaders, prioritize executive dashboard
      // But let admin appType users go to admin dashboard
      if ((user.executiveLevel || user.role === 'senior_leader') && user.appType !== 'admin') {
        return '/executive-dashboard'
      }

      // Check if user has biogas-related roles from backend
      const hasBiogasRole = user.role === 'cluster_manager' ||
                           user.appType === 'biogassangh' ||
                           (user.roles && user.roles.some((r: string) =>
                             r === 'BIOGAS_SANGH' || r === 'CLUSTER_MANAGER'))

      // Prioritize biogas users to go to cluster dashboard
      if (hasBiogasRole) {
        return '/cluster'
      }

      // Route based on app type
      switch (user.appType) {
        case 'gausakhi':
          // Field workers -> Gaushala Dashboard (cattle management)
          if (user.role === 'field_worker') {
            return '/gaushala'
          }
          return '/dashboard'

        case 'biogassangh':
          // Cluster managers -> BiogasSangh Dashboard
          return '/cluster'

        case 'urjavyapar':
          // CBG sales -> Sales dashboard
          return '/sales'

        case 'urjasanyojak':
          // Business development -> UrjaSanyojak Dashboard
          return '/urjasanyojak'

        case 'admin':
          // System administrators -> Admin dashboard
          return '/admin'

        case 'urjaneta':
          // Senior leaders/CEO -> UrjaNeta executive analytics
          return '/urja-neta'

        case 'shuddhidoot':
          // Purification operators -> Purification dashboard
          return '/purification'

        default:
          // Default fallback
          return '/dashboard'
      }
    }

    // Only redirect if we're on the root path or login redirect
    if (location.pathname === '/' || location.pathname === '/dashboard') {
      const defaultRoute = getDefaultRouteForUser()
      console.log(`Routing ${user.name} (${user.role}/${user.appType}) to ${defaultRoute}`)
      navigate(defaultRoute, { replace: true })
    }
  }, [user, loading, location, navigate])

  // This component doesn't render anything, it just handles routing
  return null
}

export default RoleBasedRouter