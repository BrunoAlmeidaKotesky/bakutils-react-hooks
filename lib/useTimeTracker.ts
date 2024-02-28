import { useState, useEffect, useCallback } from "react";

function formatElapsedTime(elapsedTime: number) {
    return new Intl.DateTimeFormat('default', { minute: '2-digit', second: '2-digit' })
        .format(new Date(Date.UTC(1970, 0, 1, 0, 0, elapsedTime)));
}

const STORAGE_KEY = 'bakutils.timeTracker';
interface TimeTrackerReturn {
    elapsedTime: string;
    start: () => void;
    pause: () => void;
    reset: () => void;
    integerElapsedTime: number;
}
interface TimeTrackerConfig {
    /**@default true */
    useLocalStorage?: boolean;
    /**@default 10000 */
    saveInterval?: number;
}

export function useTimeTracker(config: TimeTrackerConfig = { saveInterval: 10000, useLocalStorage: true }): TimeTrackerReturn {
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);

    const saveState = useCallback(() => {
        const state = { startTime, elapsedTime, isActive };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [startTime, elapsedTime, isActive]);

    const start = useCallback(() => {
        setStartTime(prev => (prev === null ? Date.now() : prev));
        setIsActive(true);
    }, []);

    const pause = useCallback(() => {
        setIsActive(false);
        saveState();
    }, [saveState]);

    const reset = useCallback(() => {
        setStartTime(null);
        setElapsedTime(0);
        setIsActive(false);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive]);

    useEffect(() => {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            const { startTime, elapsedTime, isActive } = JSON.parse(savedState);
            setStartTime(startTime);
            setElapsedTime(elapsedTime);
            setIsActive(isActive);
        }
    }, []);

    useEffect(() => {
        if (isActive && config.useLocalStorage) {
            const interval = setInterval(saveState, config.saveInterval);
            return () => clearInterval(interval);
        }
    }, [isActive, saveState, config]);

    return {
        elapsedTime: formatElapsedTime(elapsedTime),
        start,
        pause,
        reset,
        integerElapsedTime: elapsedTime,
    };
}
