'use client'
import { WalletDashboard } from './components/WalletDashboard'
import { AuthForm } from './components/AuthForm'
import { WalletSetup } from './components/WalletSetup'
import { useWallet } from './providers/WalletProvider'
import WalletHomepage from "@/app/components/WalletHomepage";

export default function Home() {
  const { isAuthenticated, hasWallet } = useWallet()

  if (!isAuthenticated) {
    return <WalletHomepage/>
  }

  if (!hasWallet) {
    return <WalletSetup />
  }

  return <WalletDashboard />
}