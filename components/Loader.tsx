import { Html, useProgress } from "@react-three/drei";
import { useEffect } from "react";

export default function Loader({ setReady }: { setReady: (val: boolean) => void }) {
    const { progress } = useProgress();

    useEffect(() => {
        // Quando chegar a 100%, libera a página
        if (progress === 100) {
            const timer = setTimeout(() => setReady(true), 500);
            return () => clearTimeout(timer);
        }
    }, [progress, setReady]);

    return (
        <Html center>
            <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-white font-mono text-xs">
                    {Math.round(progress)}%
                </p>
            </div>
        </Html>
    );
}
