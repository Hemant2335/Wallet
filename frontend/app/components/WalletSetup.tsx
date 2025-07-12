'use client'
import { useState } from 'react'
import { useWallet } from '../providers/WalletProvider'

export function WalletSetup() {
    const { createWallet, isCreatingWallet, logout } = useWallet()
    const [showOptions, setShowOptions] = useState(false)
    const [selectedAction, setSelectedAction] = useState<string | null>(null)

    const handleCreateWallet = async () => {
        setSelectedAction('create')
        const success = await createWallet()
        if (!success) {
            alert('Failed to create wallet. Please try again.')
            setSelectedAction(null)
        }
    }

    const walletTriggers = [
        {
            id: 'add-money',
            title: 'Add Money to Your Account',
            description: 'Deposit funds from your bank account or card',
            icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            ),
            action: handleCreateWallet
        },
        {
            id: 'send-money',
            title: 'Send Money to Someone',
            description: 'Transfer money to friends, family, or businesses',
            icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            ),
            action: handleCreateWallet
        },
        {
            id: 'view-wallet',
            title: 'Access My Wallet',
            description: 'View your balance and transaction history',
            icon: (
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            action: handleCreateWallet
        }
    ]

    if (isCreatingWallet) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Setting Up Your Wallet</h2>
                    <p className="text-gray-600">
                        We're creating your secure digital wallet. This will only take a moment...
                    </p>
                    <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center text-sm text-blue-800">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Your wallet will be encrypted and secured with bank-level security
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-gray-900">Welcome to Your Digital Wallet</h1>
                        <button
                            onClick={logout}
                            className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Welcome Section */}
                <div className="text-center mb-12">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Your Wallet Will Be Created When You Need It
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We follow a secure approach - your digital wallet is created only when you perform your first financial action.
                        This ensures better security and compliance with financial regulations.
                    </p>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {walletTriggers.map((trigger) => (
                        <div
                            key={trigger.id}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                            onClick={trigger.action}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="p-4 bg-gray-50 rounded-full mb-4">
                                    {trigger.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {trigger.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {trigger.description}
                                </p>
                                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Section */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Why We Create Wallets This Way
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-start space-x-4">
                            <div className="p-2 bg-green-100 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Enhanced Security</h4>
                                <p className="text-gray-600">Financial records are only created when you actually need them, reducing security risks.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Better Performance</h4>
                                <p className="text-gray-600">Our system runs more efficiently by avoiding unused wallet creation.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="p-2 bg-purple-100 rounded-full">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Regulatory Compliance</h4>
                                <p className="text-gray-600">Meets financial compliance requirements by creating accounts only when needed.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="p-2 bg-orange-100 rounded-full">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">User-Friendly</h4>
                                <p className="text-gray-600">You can explore and register without any financial commitment upfront.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}