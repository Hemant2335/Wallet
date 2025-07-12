import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { WalletProvider } from './providers/WalletProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Digital Wallet',
    description: 'Modern digital wallet application',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <WalletProvider>
            {children}
        </WalletProvider>
        </body>
        </html>
    )
}