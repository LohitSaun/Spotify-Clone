import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { LoginPromptProvider } from '@/features/auth/LoginPromptContext'
import { PlayerProvider } from '@/features/player/PlayerProvider'
import { PremiumGateProvider } from '@/features/player/PremiumGateContext'
import { router } from '@/routes/router'

function App() {
  return (
    <AuthProvider>
      <LoginPromptProvider>
        <PremiumGateProvider>
          <PlayerProvider>
            <RouterProvider router={router} />
          </PlayerProvider>
        </PremiumGateProvider>
      </LoginPromptProvider>
    </AuthProvider>
  )
}

export default App
