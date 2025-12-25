'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
            <div className="w-32 h-32 bg-yellow-400 border-4 border-dead-black rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <AlertCircle className="w-16 h-16 text-white" />
            </div>

            <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                    ENGINE <br /> STALLED.
                </h1>
                <p className="text-xl font-bold uppercase tracking-tight text-gray-400 max-w-lg mx-auto">
                    SOMETHING WENT WRONG ON OUR END. WE'RE WORKING TO GET YOUR BOLD FIX BACK ON TRACK.
                </p>
            </div>

            <Button
                variant="primary"
                size="lg"
                onClick={() => reset()}
                className="h-16 px-10 text-xl gap-4"
            >
                <RefreshCw className="w-6 h-6" />
                REBOOT SYSTEM
            </Button>
        </div>
    );
}
