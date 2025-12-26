'use client';

import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from './ui/Button';
import { useEffect, useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from '@/lib/i18n';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Header() {
    const { t, language, setLanguage } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    const getItemCount = useCartStore((state) => state.getItemCount);
    const items = useCartStore((state) => state.items);
    const itemCount = getItemCount();

    useEffect(() => {
        setMounted(true);

        // Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const navLinks = [
        { href: '/about', label: t('nav.about') },
        { href: '/contact', label: t('nav.contact') },
    ];

    return (
        <header className="sticky top-0 z-50 bg-ivory border-b-2 border-dead-black py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4 md:gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <span className="text-3xl font-black uppercase tracking-tighter text-dead-black italic">
                            LEVEL
                        </span>
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-md">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('home.searching').toUpperCase()}
                                className="w-full bg-white border-2 border-dead-black rounded-full py-2 pl-12 pr-4 font-bold uppercase text-sm tracking-tight focus:outline-none focus:ring-2 focus:ring-crimson/20"
                            />
                        </div>
                    </div>

                    {/* Desktop Nav Actions */}
                    <div className="flex items-center gap-2 md:gap-6">
                        <nav className="hidden lg:flex items-center gap-6 mr-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-xs font-black uppercase tracking-widest text-dead-black hover:text-crimson transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2 md:gap-4 border-l-2 border-dead-black/10 pl-2 md:pl-6">
                            <Link href="/cart">
                                <Button variant="outline" size="icon" className="relative h-10 w-10 md:h-12 md:w-12">
                                    <ShoppingCart className="w-5 h-5" />
                                    {mounted && itemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-crimson text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-dead-black">
                                            {itemCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                            <Link href={user ? "/profile" : "/auth"}>
                                <Button variant={user ? "crimson" : "primary"} size="icon" className="h-10 w-10 md:h-12 md:w-12 transition-all">
                                    <User className="w-5 h-5" />
                                </Button>
                            </Link>

                            <div className="hidden md:flex border-2 border-dead-black overflow-hidden rounded-xl h-12">
                                <button
                                    onClick={() => setLanguage('en')}
                                    className={cn(
                                        "px-3 text-xs font-black transition-colors",
                                        language === 'en' ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
                                    )}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => setLanguage('it')}
                                    className={cn(
                                        "px-3 text-xs font-black border-l-2 border-dead-black transition-colors",
                                        language === 'it' ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
                                    )}
                                >
                                    IT
                                </button>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <Button
                                variant="outline"
                                size="icon"
                                className="lg:hidden h-10 w-10"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="lg:hidden mt-4 pt-4 border-t-2 border-dashed border-dead-black/10 animate-in slide-in-from-top duration-200">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-lg font-black uppercase tracking-tighter text-dead-black p-2 hover:bg-muted-cream rounded-xl transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="md:hidden pt-2">
                                <div className="relative w-full">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder={t('home.searching').toUpperCase()}
                                        className="w-full bg-white border-2 border-dead-black rounded-full py-2 pl-12 pr-4 font-bold uppercase text-sm focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex border-2 border-dead-black overflow-hidden rounded-xl mt-2">
                                <button
                                    onClick={() => { setLanguage('en'); setIsMenuOpen(false); }}
                                    className={cn(
                                        "flex-1 py-3 text-sm font-black transition-colors",
                                        language === 'en' ? "bg-black text-white" : "bg-white text-black"
                                    )}
                                >
                                    ENGLISH
                                </button>
                                <button
                                    onClick={() => { setLanguage('it'); setIsMenuOpen(false); }}
                                    className={cn(
                                        "flex-1 py-3 text-sm font-black border-l-2 border-dead-black transition-colors",
                                        language === 'it' ? "bg-black text-white" : "bg-white text-black"
                                    )}
                                >
                                    ITALIANO
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
