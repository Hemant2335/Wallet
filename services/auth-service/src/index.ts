// auth-service/server.ts
import express, { NextFunction, Response, Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { z } from "zod";
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';

dotenv.config();

const app = express();

// Define types for our in-memory storage
interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    isVerified: boolean;
    createdAt: string;
    lastLogin: string | null;
    loginCount: number;
    updatedAt?: string;
}

interface LoginAttempts {
    count: number;
    lastAttempt: number;
}

interface JwtPayload {
    userId: string;
    type: string;
    [key: string]: any;
}

// Extend the Request interface to include our custom properties
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// In-memory storage (replace with database in production)
const users = new Map<string, User>();
const refreshTokens = new Set<string>();
const loginAttempts = new Map<string, LoginAttempts>();

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-super-secret-refresh-key';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// Validation middleware
const validateRegistration = z.object({
    email: z.string().email(),
    password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional()
});

const validateLogin = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

// Helper functions
const generateTokens = (userId: string) => {
    const payload = { userId, type: 'access' };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ userId, type: 'refresh' }, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

    refreshTokens.add(refreshToken);
    return { accessToken, refreshToken };
};

const isAccountLocked = (email: string) => {
    const attempts = loginAttempts.get(email);
    if (!attempts) return false;

    const { count, lastAttempt } = attempts;
    const lockDuration = 30 * 60 * 1000; // 30 minutes

    return count >= 5 && (Date.now() - lastAttempt) < lockDuration;
};

const recordLoginAttempt = (email: string, success: boolean) => {
    if (success) {
        loginAttempts.delete(email);
        return;
    }

    const current = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    loginAttempts.set(email, {
        count: current.count + 1,
        lastAttempt: Date.now()
    });
};

// Middleware to verify JWT
// Update the authenticateToken middleware signature
const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        if (!decoded || !decoded.userId) {
            res.status(403).json({ error: 'Invalid or expired access token' });
            return;
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired access token' });
    }
};

// Routes

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'auth-service', timestamp: new Date().toISOString() });
});

// User registration
app.post('/register', authLimiter, async (req: Request, res: Response): Promise<any> => {
    try {
        const validate = validateRegistration.safeParse(req.body);
        if (!validate.success) {
            return res.status(400).json({ errors: validate.error.errors });
        }

        const { email, password, firstName, lastName, phone } = validate.data;

        if (users.has(email)) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

        const user: User = {
            id: userId,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
            isVerified: false,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            loginCount: 0
        };

        users.set(email, user);
        const { accessToken, refreshToken } = generateTokens(userId);
        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            message: 'User registered successfully',
            user: userWithoutPassword,
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User login
app.post('/login', authLimiter, async (req: Request, res: Response): Promise<any> => {
    try {
        const validate = validateLogin.safeParse(req.body);
        if (!validate.success) {
            return res.status(400).json({ errors: validate.error.errors });
        }
        const { email, password } = validate.data;

        // Check if account is locked
        if (isAccountLocked(email)) {
            return res.status(429).json({ error: 'Account temporarily locked due to too many failed attempts' });
        }

        // Find user
        const user = users.get(email);
        if (!user) {
            recordLoginAttempt(email, false);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            recordLoginAttempt(email, false);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        recordLoginAttempt(email, true);

        // Update user login info
        user.lastLogin = new Date().toISOString();
        user.loginCount += 1;

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.id);

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            user: userWithoutPassword,
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Refresh token
app.post('/refresh', (req: Request, res: Response): any => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' });
        }

        if (!refreshTokens.has(refreshToken)) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        jwt.verify(refreshToken, REFRESH_SECRET, (err:any, decoded:any) => {
            if (err || !decoded || typeof decoded !== 'object') {
                refreshTokens.delete(refreshToken);
                return res.status(403).json({ error: 'Invalid or expired refresh token' });
            }

            const payload = decoded as JwtPayload;
            if (payload.type !== 'refresh') {
                return res.status(403).json({ error: 'Invalid token type' });
            }

            // Remove old refresh token and generate new tokens
            refreshTokens.delete(refreshToken);
            const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload.userId);

            res.json({
                accessToken,
                refreshToken: newRefreshToken
            });
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout
// @ts-ignore
app.post('/logout', authenticateToken, (req: Request, res: Response): any => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            refreshTokens.delete(refreshToken);
        }

        res.json({ message: 'Logout successful' });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user profile
app.get('/profile', authenticateToken, (req: Request, res: Response) :any => {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Find user by ID
        const user = Array.from(users.values()).find(u => u.id === req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });

    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user profile
// @ts-ignore
app.put('/profile', authenticateToken, [
    body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
    body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
    body('phone').optional().isMobilePhone('any')
], (req: Request, res: Response):any => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!req.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Find user by ID
        const userEntry = Array.from(users.entries()).find(([_, u]) => u.id === req.userId);

        if (!userEntry) {
            return res.status(404).json({ error: 'User not found' });
        }

        const [email, user] = userEntry;
        const { firstName, lastName, phone } = req.body;

        // Update user data
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;
        user.updatedAt = new Date().toISOString();

        users.set(email, user);

        const { password: _, ...userWithoutPassword } = user;
        res.json({
            message: 'Profile updated successfully',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Change password
app.put('/change-password', authenticateToken, [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
], async (req: Request, res: Response) : Promise<any> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        if (!req.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { currentPassword, newPassword } = req.body;

        // Find user by ID
        const userEntry = Array.from(users.entries()).find(([_, u]) => u.id === req.userId);

        if (!userEntry) {
            return res.status(404).json({ error: 'User not found' });
        }

        const [email, user] = userEntry;

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        user.password = hashedNewPassword;
        user.updatedAt = new Date().toISOString();

        users.set(email, user);

        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify token (for other services)
app.post('/verify', (req: Request, res: Response) :any => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token required' });
        }

        jwt.verify(token, JWT_SECRET, (err :any, decoded:any) => {
            if (err || !decoded || typeof decoded !== 'object') {
                return res.status(403).json({ error: 'Invalid or expired token', valid: false });
            }

            const payload = decoded as JwtPayload;
            if (payload.type !== 'access') {
                return res.status(403).json({ error: 'Invalid token type', valid: false });
            }

            res.json({
                valid: true,
                userId: payload.userId,
                exp: payload.exp
            });
        });

    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/' , (req: Request, res: Response) : any => {
    res.json({
        message: 'Auth Service is running',
        timestamp: new Date().toISOString()
    });
})
app.listen(3001, () => {
    console.log(`🔐 Auth Service running on port 3001`);
});

export default app;