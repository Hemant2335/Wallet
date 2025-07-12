'use client'
import { useWallet } from '../providers/WalletProvider'

export function TransactionList() {
    const { transactions } = useWallet()

    return (
        <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`p-2 rounded-full ${
                                transaction.type === 'receive' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                                {transaction.type === 'receive' ? (
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">
                                    {transaction.type === 'receive' ? 'Received from' : 'Sent to'} {transaction.from || transaction.to}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {transaction.date.toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-sm font-medium ${
                                transaction.type === 'receive' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {transaction.type === 'receive' ? '+' : '-'}${transaction.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 capitalize">{transaction.status}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}