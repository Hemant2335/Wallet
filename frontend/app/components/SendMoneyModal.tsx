'use client'
import { useState } from 'react'
import { useWallet } from '../providers/WalletProvider'

interface SendMoneyModalProps {
    onClose: () => void
}

export function SendMoneyModal({ onClose }: SendMoneyModalProps) {
    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const { sendMoney, balance } = useWallet()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const numAmount = parseFloat(amount)

        if (numAmount <= 0 || numAmount > balance) {
            alert('Invalid amount')
            return
        }

        setLoading(true)
        const success = await sendMoney(recipient, numAmount)

        if (success) {
            onClose()
        } else {
            alert('Transaction failed')
        }
        setLoading(false)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Send Money</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Recipient Email
                        </label>
                        <input
                            type="email"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter recipient email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max={balance}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">Available: ${balance.toFixed(2)}</p>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Money'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}