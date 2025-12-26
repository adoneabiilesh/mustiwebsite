'use client';

import { Home, Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function BottomNav() {
    const pathname = usePathname();
    const getItemCount = useCartStore((state) => state.getItemCount);
    const [mounted, setMounted] = useState(false);
    const itemCount = getItemCount();

    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = [
        { href: '/', icon: Home, label: 'Home' },
        { href: '/search', icon: Search, label: 'Search' },
        { href: '/cart', icon: ShoppingCart, label: 'Cart', badge: true },
        { href: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-ivory border-t-4 border-dead-black px-4 pb-6 pt-3 shadow-[0_-4px_0_0_rgba(0,0,0,1)]">
            <div className="flex items-center justify-around max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col items-center gap-1 p-2 rounded-2xl transition-all active:scale-95",
                                isActive ? "bg-crimson text-white -translate-y-1" : "text-dead-black"
                            )}
                        >
                            <Icon className={cn("w-6 h-6", isActive ? "stroke-[3px]" : "stroke-2")} />
                            {item.badge && mounted && itemCount > 0 && (
                                <span className="absolute top-1 right-1 bg-white text-crimson text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-dead-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                    {itemCount}
                                </span>
                            )}
                            <span className="text-[10px] font-black uppercase tracking-tighter">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
