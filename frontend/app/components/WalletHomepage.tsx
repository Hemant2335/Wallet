import React, { useState, useEffect } from 'react';
import { Wallet, Shield, Zap, TrendingUp, Users, Globe, ArrowRight, Menu, X, Check, CreditCard, Smartphone, Send } from 'lucide-react';

const WalletLandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Bank-Grade Security",
            description: "Advanced encryption and multi-layer security protocols protect your money with enterprise-level protection and fraud detection."
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Instant Transfers",
            description: "Send money to friends and family instantly with our optimized payment infrastructure and real-time processing."
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: "Global Payments",
            description: "Send and receive money worldwide with support for multiple currencies and international money transfers."
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Expense Tracking",
            description: "Monitor your spending patterns, budget goals, and financial insights with intelligent analytics and reporting."
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Family Accounts",
            description: "Create shared family wallets, kids' accounts, and group spending with easy management and parental controls."
        },
        {
            icon: <CreditCard className="w-8 h-8" />,
            title: "Card Integration",
            description: "Link your credit cards, debit cards, and bank accounts for seamless payments and account management."
        }
    ];

    const stats = [
        { number: "2M+", label: "Active Users" },
        { number: "$50B+", label: "Transferred" },
        { number: "99.9%", label: "Uptime" },
        { number: "150+", label: "Countries" }
    ];

    const pricingPlans = [
        {
            name: "Personal",
            price: "Free",
            description: "Perfect for personal money management",
            features: [
                "Send & receive money",
                "Basic expense tracking",
                "Mobile app access",
                "Customer support",
                "Standard security"
            ]
        },
        {
            name: "Premium",
            price: "$4.99/mo",
            description: "Advanced features for smart spending",
            features: [
                "Everything in Personal",
                "Advanced analytics",
                "Budget planning tools",
                "International transfers",
                "Priority support",
                "Premium card benefits"
            ],
            popular: true
        },
        {
            name: "Family",
            price: "$9.99/mo",
            description: "Complete solution for families",
            features: [
                "Everything in Premium",
                "Up to 6 family members",
                "Parental controls",
                "Shared budgets",
                "Family spending insights",
                "Custom allowances"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-gray-900 to-[#1a1a1a] text-white overflow-x-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-gray-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
            </div>

            {/* Header */}
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-[#1a1a1a]/90 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'}`}>
                <nav className="container mx-auto px-8 lg:px-12 py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            PayWallet
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="hover:text-blue-400 transition-colors duration-300">Features</a>
                            <a href="#pricing" className="hover:text-blue-400 transition-colors duration-300">Pricing</a>
                            <a href="#about" className="hover:text-blue-400 transition-colors duration-300">About</a>
                            <a href="#contact" className="hover:text-blue-400 transition-colors duration-300">Contact</a>
                            <button className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2 rounded-full hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-blue-500/25">
                                Get Started
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden mt-4 p-4 bg-gray-800/90 backdrop-blur-lg rounded-lg border border-white/10">
                            <div className="flex flex-col space-y-4">
                                <a href="#features" className="hover:text-blue-400 transition-colors duration-300">Features</a>
                                <a href="#pricing" className="hover:text-blue-400 transition-colors duration-300">Pricing</a>
                                <a href="#about" className="hover:text-blue-400 transition-colors duration-300">About</a>
                                <a href="#contact" className="hover:text-blue-400 transition-colors duration-300">Contact</a>
                                <button className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2 rounded-full">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    )}
                </nav>
            </header>

            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center px-8 lg:px-12 pt-20 relative">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 animate-fade-in-up">
                            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                                Smart Money{' '}
                                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-gray-400 bg-clip-text text-transparent">
                  Management
                </span>
                            </h1>

                            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed">
                                Take control of your finances with our intelligent digital wallet.
                                Send money, track expenses, and manage your budget all in one place.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center gap-2">
                                    Access wallet
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                <button className="border-2 border-white/20 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                                    Learn More
                                </button>
                            </div>
                        </div>

                        <div className="relative animate-fade-in-right">
                            <div className="relative z-10">
                                {/* Wallet Card */}
                                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl animate-float">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <p className="text-gray-400 text-sm">Account Balance</p>
                                            <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                                $3,247.85
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
                                            <Wallet className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Checking</span>
                                            <span className="font-semibold">$2,847.85</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Savings</span>
                                            <span className="font-semibold">$400.00</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Rewards</span>
                                            <span className="font-semibold">$124.50</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-white/10">
                                        <div className="flex gap-4">
                                            <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                                                <Send className="w-4 h-4" />
                                                Send
                                            </button>
                                            <button className="flex-1 border border-white/20 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                                <Smartphone className="w-4 h-4" />
                                                Request
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Transaction Cards */}
                                <div className="absolute -top-4 -right-4 bg-green-500/20 backdrop-blur-xl rounded-2xl p-4 border border-green-500/30 animate-pulse-slow">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <ArrowRight className="w-4 h-4 rotate-45" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">+$500.00</p>
                                            <p className="text-xs text-gray-400">Salary</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -bottom-4 -left-4 bg-blue-500/20 backdrop-blur-xl rounded-2xl p-4 border border-blue-500/30 animate-pulse-slow" style={{animationDelay: '1s'}}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">Budget on track</p>
                                            <p className="text-xs text-gray-400">85% remaining</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-8 lg:px-12 relative">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-400 text-lg">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-8 lg:px-12 relative">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-6">
                            Smart{' '}
                            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Features
              </span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Everything you need to manage your money smarter, safer, and more efficiently
                            with our comprehensive digital wallet solution.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
                            >
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 px-8 lg:px-12 relative">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-6">
                            Simple{' '}
                            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Pricing
              </span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Choose the perfect plan for your financial needs. Start free and upgrade as you grow.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`bg-white/5 backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 hover:scale-105 relative ${
                                    plan.popular
                                        ? 'border-blue-500/50 shadow-2xl shadow-blue-500/20'
                                        : 'border-white/10 hover:border-blue-500/30'
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 rounded-full text-sm font-semibold">
                                            Most Popular
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="text-4xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                                    </div>
                                    <p className="text-gray-400">{plan.description}</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <div key={featureIndex} className="flex items-center gap-3">
                                            <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                                                <Check className="w-3 h-3 text-green-400" />
                                            </div>
                                            <span className="text-gray-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                                    plan.popular
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:scale-105 shadow-lg hover:shadow-blue-500/25'
                                        : 'border-2 border-white/20 hover:bg-white/10'
                                }`}>
                                    Get Started
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-8 lg:px-12 relative">
                <div className="container mx-auto max-w-7xl text-center">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 max-w-4xl mx-auto">
                        <h2 className="text-5xl font-bold mb-6">
                            Ready to Take Control of Your{' '}
                            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Financial Life?
              </span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join millions of users who trust PayWallet for their daily financial needs.
                            Start managing your money smarter today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center gap-2">
                                Access Wallet
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button className="border-2 border-white/20 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300">
                                Watch Demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 px-8 lg:px-12 bg-black/20">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4">
                                PayWallet
                            </div>
                            <p className="text-gray-400">
                                Smart money management for everyone.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4 text-blue-400">Product</h3>
                            <div className="space-y-2">
                                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Features</a>
                                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Security</a>
                                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Mobile App</a>
                                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Pricing</a>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4 text-blue-400">Company</h3>
                            <div className="space-y-2">
                                <a href="#" className="block text-gray-400 hover:text-white transition-colors">About</a>
                                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Careers</a>
                                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Blog</a>
                                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4 text-blue-400">Support</h3>
                            <div className="space-y-2">
                                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Help Center</a>
                                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Community</a>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 PayWallet. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WalletLandingPage;