export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-8 border-muted-cream rounded-full"></div>
                <div className="absolute inset-0 border-8 border-crimson rounded-full border-t-transparent animate-spin"></div>
            </div>

            <div className="space-y-4">
                <h2 className="text-5xl font-black uppercase tracking-tighter italic animate-pulse">
                    LEVELING UP...
                </h2>
                <div className="flex gap-2 justify-center">
                    <div className="w-3 h-3 bg-dead-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-3 h-3 bg-dead-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-3 h-3 bg-dead-black rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );
}
