import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Map } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
            <div className="relative">
                <div className="w-32 h-32 bg-crimson border-4 border-dead-black rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-bounce-slow">
                    <Map className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 bg-white border-2 border-dead-black px-4 py-2 rounded-xl font-black text-xl rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    404
                </div>
            </div>

            <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                    RESTAURANT NOT <br /> IN THIS GRID.
                </h1>
                <p className="text-xl font-bold uppercase tracking-tight text-gray-400">
                    THE BOLD FLAVOR YOU'RE LOOKING FOR HAS MOVED OR NEVER LIVED HERE.
                </p>
            </div>

            <Link href="/">
                <Button variant="primary" size="lg" className="h-16 px-10 text-xl">
                    BACK TO BASECAMP
                </Button>
            </Link>
        </div>
    );
}
