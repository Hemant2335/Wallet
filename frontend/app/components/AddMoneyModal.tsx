'use client'
import { useState } from 'react'
import { useWallet } from '../providers/WalletProvider'

interface AddMoneyModalProps {
    onClose: () => void
}

export function AddMoneyModal({ onClose }: AddMoneyModalProps) {
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const { addMoney } = useWallet()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const numAmount = parseFloat(amount)

        if (numAmount <= 0) {
            alert('Invalid amount')
            return
        }

        setLoading(true)
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000))
        addMoney(numAmount)
        setLoading(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Add Money</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount to Add
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium">Bank Account</p>
                                <p className="text-sm text-gray-500">****1234</p>
                            </div>
                        </div>
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
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Add Money'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}