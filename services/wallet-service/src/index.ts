// wallet-service/wallet-manager.js
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Define interfaces for our data structures
interface Wallet {
    id: string;
    userId: string;
    accountNumber: string;
    balance: number;
    currency: string;
    status: string;
    createdAt: string;
    lastActivity: string;
    creationTrigger: string;
    dailyTransferLimit: number;
    monthlyTransferLimit: number;
    currentDailySpent: number;
    currentMonthlySpent: number;
    totalTransactions: number;
    totalReceived: number;
    totalSent: number;
    riskScore: number;
    flaggedTransactions: number;
    lastRiskAssessment: string;
}

interface Transaction {
    id: string;
    walletId: string;
    userId: string;
    type: string;
    amount: number;
    description: string;
    status: string;
    createdAt: string;
    metadata: {
        [key: string]: any;
    };
    recipientEmail?: string;
}

interface WalletCreationLog {
    userId: string;
    userEmail: string;
    trigger: string;
    timestamp: string;
    ipAddress: string | null;
}

interface User {
    id: string;
    email: string;
}

// In-memory storage with proper typing
const wallets: Map<string, Wallet> = new Map();
const transactions: Map<string, Transaction> = new Map();
const walletCreationLog: Map<string, WalletCreationLog> = new Map();

// Wallet creation service
class WalletService {
    // Check if user has a wallet
    static hasWallet(userId: string): boolean {
        return Array.from(wallets.values()).some(wallet => wallet.userId === userId);
    }

    // Get user's wallet (returns null if doesn't exist)
    static getWallet(userId: string): Wallet | null {
        return Array.from(wallets.values()).find(wallet => wallet.userId === userId) || null;
    }

    // Create wallet for user (lazy creation)
    static async createWallet(userId: string, userEmail: string, trigger: string = 'unknown'): Promise<{ success: boolean; error?: string; wallet: Wallet | null }> {
        try {
            // Check if wallet already exists
            if (this.hasWallet(userId)) {
                return {
                    success: false,
                    error: 'Wallet already exists',
                    wallet: this.getWallet(userId)
                };
            }

            // Generate unique wallet ID and account number
            const walletId = `wallet_${Date.now()}_${uuidv4().substr(0, 8)}`;
            const accountNumber = this.generateAccountNumber();

            // Create wallet object
            const wallet: Wallet = {
                id: walletId,
                userId: userId,
                accountNumber: accountNumber,
                balance: 0.00,
                currency: 'USD',
                status: 'active',
                createdAt: new Date().toISOString(),
                lastActivity: new Date().toISOString(),
                creationTrigger: trigger,

                // Security features
                dailyTransferLimit: 5000.00,
                monthlyTransferLimit: 50000.00,
                currentDailySpent: 0.00,
                currentMonthlySpent: 0.00,

                // Metadata
                totalTransactions: 0,
                totalReceived: 0.00,
                totalSent: 0.00,

                // Fraud detection flags
                riskScore: 0,
                flaggedTransactions: 0,
                lastRiskAssessment: new Date().toISOString()
            };

            // Store wallet
            wallets.set(walletId, wallet);

            // Log wallet creation for audit
            walletCreationLog.set(walletId, {
                userId,
                userEmail,
                trigger,
                timestamp: new Date().toISOString(),
                ipAddress: null
            });

            console.log(`✅ Wallet created for user ${userId} (trigger: ${trigger})`);

            return { success: true, wallet: wallet };

        } catch (error) {
            console.error('Wallet creation error:', error);
            return { success: false, error: 'Failed to create wallet' , wallet: null };
        }
    }

    // Generate unique account number
    static generateAccountNumber(): string {
        const prefix = 'SW';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `${prefix}${timestamp}${random}`;
    }

    // Ensure wallet exists (create if not) - Main function for lazy creation
    static async ensureWallet(userId: string, userEmail: string, trigger: string = 'lazy_creation'): Promise<Wallet> {
        let wallet = this.getWallet(userId);

        if (!wallet) {
            const result = await this.createWallet(userId, userEmail, trigger);
            if (result.success && result.wallet) {
                wallet = result.wallet;
            } else {
                throw new Error(result.error || 'Unknown error creating wallet');
            }
        }

        return wallet;
    }

    // Update wallet balance
    static updateBalance(walletId: string, amount: number, type: 'credit' | 'debit' = 'credit'): Wallet {
        const wallet = wallets.get(walletId);
        if (!wallet) {
            throw new Error('Wallet not found');
        }

        const previousBalance = wallet.balance;

        if (type === 'credit') {
            wallet.balance += amount;
            wallet.totalReceived += amount;
        } else if (type === 'debit') {
            if (wallet.balance < amount) {
                throw new Error('Insufficient funds');
            }
            wallet.balance -= amount;
            wallet.totalSent += amount;
            wallet.currentDailySpent += amount;
            wallet.currentMonthlySpent += amount;
        }

        wallet.lastActivity = new Date().toISOString();
        wallet.totalTransactions += 1;

        console.log(`💰 Balance updated: ${walletId} ${previousBalance} -> ${wallet.balance} (${type}: ${amount})`);

        return wallet;
    }
}

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

// Authentication middleware
const authenticateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) : Promise<any> => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    // Mock user data - replace with actual JWT verification
    req.user = {
        id: 'user_123',
        email: 'user@example.com'
    };

    next();
};

// API Routes

// Get wallet (creates if doesn't exist)
app.get('/wallet', authenticateUser, async (req: express.Request, res: express.Response) : Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const wallet = await WalletService.ensureWallet(
            req.user.id,
            req.user.email,
            'wallet_access'
        );

        res.json({
            message: 'Wallet retrieved successfully',
            wallet: wallet
        });

    } catch (error) {
        console.error('Get wallet error:', error);
        res.status(500).json({ error: 'Failed to retrieve wallet' });
    }
});

// Add funds to wallet (creates wallet if needed)
app.post('/wallet/add-funds', authenticateUser, async (req: express.Request, res: express.Response) : Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { amount, paymentMethod } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Ensure wallet exists
        const wallet = await WalletService.ensureWallet(
            req.user.id,
            req.user.email,
            'add_funds'
        );

        // Update wallet balance
        const updatedWallet = WalletService.updateBalance(wallet.id, amount, 'credit');

        // Create transaction record
        const transactionId = `txn_${Date.now()}_${uuidv4().substr(0, 8)}`;
        const transaction: Transaction = {
            id: transactionId,
            walletId: wallet.id,
            userId: req.user.id,
            type: 'deposit',
            amount: amount,
            description: `Funds added via ${paymentMethod}`,
            status: 'completed',
            createdAt: new Date().toISOString(),
            metadata: {
                paymentMethod,
                trigger: 'add_funds'
            }
        };

        transactions.set(transactionId, transaction);

        res.json({
            message: 'Funds added successfully',
            wallet: updatedWallet,
            transaction: transaction
        });

    } catch (error) {
        console.error('Add funds error:', error);
        res.status(500).json({ error: 'Failed to add funds' });
    }
});

// Send money (P2P transfer) - creates wallet if needed
app.post('/wallet/send', authenticateUser, async (req: express.Request, res: express.Response) : Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { recipientEmail, amount, description } = req.body;

        if (!recipientEmail || !amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid transfer details' });
        }

        // Ensure sender has wallet
        const senderWallet = await WalletService.ensureWallet(
            req.user.id,
            req.user.email,
            'p2p_send'
        );

        // Check if sender has sufficient funds
        if (senderWallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        // Check daily/monthly limits
        if (senderWallet.currentDailySpent + amount > senderWallet.dailyTransferLimit) {
            return res.status(400).json({ error: 'Daily transfer limit exceeded' });
        }

        // Process transfer
        const updatedSenderWallet = WalletService.updateBalance(senderWallet.id, amount, 'debit');

        // Create transaction record
        const transactionId = `txn_${Date.now()}_${uuidv4().substr(0, 8)}`;
        const transaction: Transaction = {
            id: transactionId,
            walletId: senderWallet.id,
            userId: req.user.id,
            type: 'transfer_out',
            amount: amount,
            description: description || `Transfer to ${recipientEmail}`,
            status: 'completed',
            recipientEmail: recipientEmail,
            createdAt: new Date().toISOString(),
            metadata: {
                trigger: 'p2p_transfer'
            }
        };

        transactions.set(transactionId, transaction);

        res.json({
            message: 'Transfer completed successfully',
            wallet: updatedSenderWallet,
            transaction: transaction
        });

    } catch (error) {
        console.error('Send money error:', error);
        res.status(500).json({ error: 'Failed to process transfer' });
    }
});

// Get wallet status (check if exists without creating)
app.get('/wallet/status', authenticateUser, (req: express.Request, res: express.Response) : any => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const hasWallet = WalletService.hasWallet(req.user.id);
        const wallet = WalletService.getWallet(req.user.id);

        res.json({
            hasWallet: hasWallet,
            wallet: wallet
        });

    } catch (error) {
        console.error('Wallet status error:', error);
        res.status(500).json({ error: 'Failed to check wallet status' });
    }
});

// Get transaction history
app.get('/wallet/transactions', authenticateUser, async (req: express.Request, res: express.Response) : Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Ensure wallet exists
        const wallet = await WalletService.ensureWallet(
            req.user.id,
            req.user.email,
            'view_transactions'
        );

        // Get user's transactions
        const userTransactions = Array.from(transactions.values())
            .filter(txn => txn.userId === req.user?.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        res.json({
            wallet: wallet,
            transactions: userTransactions
        });

    } catch (error) {
        console.error('Transaction history error:', error);
        res.status(500).json({ error: 'Failed to retrieve transactions' });
    }
});

// Admin: Get wallet creation stats
app.get('/admin/wallet-stats', (req: express.Request, res: express.Response) => {
    try {
        const stats: {
            totalWallets: number;
            totalTransactions: number;
            creationTriggers: { [key: string]: number };
        } = {
            totalWallets: wallets.size,
            totalTransactions: transactions.size,
            creationTriggers: {}
        };

        // Count creation triggers
        Array.from(walletCreationLog.values()).forEach(log => {
            stats.creationTriggers[log.trigger] = (stats.creationTriggers[log.trigger] || 0) + 1;
        });

        res.json(stats);

    } catch (error) {
        console.error('Wallet stats error:', error);
        res.status(500).json({ error: 'Failed to retrieve stats' });
    }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`💳 Wallet Service running on port ${PORT}`);
    console.log(`🔄 Lazy wallet creation enabled`);
});

export { app, WalletService };

// Example usage in your frontend:
/*
// 1. User registers (no wallet created yet)
POST /auth/register

// 2. User accesses wallet page (wallet created lazily)
GET /wallet

// 3. User adds funds (wallet created if needed)
POST /wallet/add-funds

// 4. User sends money (wallet created if needed)
POST /wallet/send

// 5. Check if user has wallet without creating
GET /wallet/status
*/