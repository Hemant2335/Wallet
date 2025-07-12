'use client'
import { useState } from 'react'
import { useWallet } from '../providers/WalletProvider'
import { TransactionList } from './TransactionList'
import { SendMoneyModal } from './SendMoneyModal'
import { AddMoneyModal } from './AddMoneyModal'

export function WalletDashboard() {
    const { balance, logout } = useWallet()
    const [showSendModal, setShowSendModal] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
                        <button
                            onClick={logout}
                            className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Balance Card */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-8">
                    <h2 className="text-lg font-medium opacity-90">Total Balance</h2>
                    <p className="text-4xl font-bold mt-2">${balance.toFixed(2)}</p>
                    <div className="flex space-x-4 mt-6">
                        <button
                            onClick={() => setShowSendModal(true)}
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Send Money
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Add Money
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Quick Send</h3>
                                <p className="text-gray-600">Send money to contacts</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Pay Bills</h3>
                                <p className="text-gray-600">Utilities and services</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                                <p className="text-gray-600">Spending insights</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                    </div>
                    <TransactionList />
                </div>
            </main>

            {/* Modals */}
            {showSendModal && <SendMoneyModal onClose={() => setShowSendModal(false)} />}
            {showAddModal && <AddMoneyModal onClose={() => setShowAddModal(false)} />}
        </div>
    )
}