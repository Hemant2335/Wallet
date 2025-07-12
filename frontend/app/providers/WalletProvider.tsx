'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

interface Transaction {
    id: string
    type: 'send' | 'receive'
    amount: number
    to?: string
    from?: string
    date: Date
    status: 'completed' | 'pending' | 'failed'
}

interface WalletContextType {
    balance: number
    transactions: Transaction[]
    isAuthenticated: boolean
    hasWallet: boolean
    isCreatingWallet: boolean
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    sendMoney: (to: string, amount: number) => Promise<boolean>
    addMoney: (amount: number) => Promise<void>
    createWallet: () => Promise<boolean>
    accessWallet: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [balance, setBalance] = useState(0)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [hasWallet, setHasWallet] = useState(false)
    const [isCreatingWallet, setIsCreatingWallet] = useState(false)

    const login = async (email: string, password: string): Promise<boolean> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (email && password) {
            setIsAuthenticated(true)
            // Check if user has an existing wallet (simulate API call)
            const userHasWallet = Math.random() > 0.7 // 30% chance user already has wallet
            setHasWallet(userHasWallet)
            if (userHasWallet) {
                // Load existing wallet data
                setBalance(1250.50)
                setTransactions([
                    {
                        id: '1',
                        type: 'receive',
                        amount: 500,
                        from: 'john.doe@email.com',
                        date: new Date('2024-01-15'),
                        status: 'completed'
                    },
                    {
                        id: '2',
                        type: 'send',
                        amount: 150,
                        to: 'jane.smith@email.com',
                        date: new Date('2024-01-14'),
                        status: 'completed'
                    }
                ])
            }
            return true
        }
        return false
    }

    const logout = () => {
        setIsAuthenticated(false)
        setHasWallet(false)
        setBalance(0)
        setTransactions([])
    }

    const createWallet = async (): Promise<boolean> => {
        setIsCreatingWallet(true)
        try {
            // Simulate wallet creation API call
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Initialize wallet with zero balance
            setHasWallet(true)
            setBalance(0)
            setTransactions([])

            return true
        } catch (error) {
            console.error('Failed to create wallet:', error)
            return false
        } finally {
            setIsCreatingWallet(false)
        }
    }

    const accessWallet = async (): Promise<void> => {
        if (!hasWallet) {
            await createWallet()
        }
    }

    const sendMoney = async (to: string, amount: number): Promise<boolean> => {
        // Create wallet if it doesn't exist
        if (!hasWallet) {
            const walletCreated = await createWallet()
            if (!walletCreated) return false
        }

        if (amount > balance) return false

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        const newTransaction: Transaction = {
            id: Date.now().toString(),
            type: 'send',
            amount,
            to,
            date: new Date(),
            status: 'completed'
        }

        setTransactions(prev => [newTransaction, ...prev])
        setBalance(prev => prev - amount)
        return true
    }

    const addMoney = async (amount: number): Promise<void> => {
        // Create wallet if it doesn't exist
        if (!hasWallet) {
            const walletCreated = await createWallet()
            if (!walletCreated) throw new Error('Failed to create wallet')
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        const newTransaction: Transaction = {
            id: Date.now().toString(),
            type: 'receive',
            amount,
            from: 'Bank Transfer',
            date: new Date(),
            status: 'completed'
        }

        setTransactions(prev => [newTransaction, ...prev])
        setBalance(prev => prev + amount)
    }

    return (
        <WalletContext.Provider value={{
            balance,
            transactions,
            isAuthenticated,
            hasWallet,
            isCreatingWallet,
            login,
            logout,
            sendMoney,
            addMoney,
            createWallet,
            accessWallet
        }}>
            {children}
        </WalletContext.Provider>
    )
}

export const useWallet = () => {
    const context = useContext(WalletContext)
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider')
    }
    return context
}