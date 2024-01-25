import { useState, useEffect } from "react";

function formatTimeLeft(timeLeft: number) {
    return new Intl.DateTimeFormat('default', { minute: '2-digit', second: '2-digit' })
        .format(new Date(Date.UTC(1970, 0, 1, 0, 0, timeLeft)));
}

/**
 * Custom hook to create a countdown timer.
 * 
 * @param initialTime The initial time in seconds for the countdown.
 * @param shouldRun A boolean or a function that returns a boolean indicating if the countdown should run.
 * @returns An object containing:
 * - `timeLeft`: A string representing the remaining time in "mm:ss" format.
 * - `resetCountdown`: A function to reset the countdown to its initial time.
 * - `isCountdownOver`: A boolean indicating if the countdown has reached zero.
 * - `integerTimeLeft`: The remaining time as an integer.
 * 
 * The countdown decrements in real time and can be controlled via `shouldRun`.
 * 
 * Use `resetCountdown` to manually reset the timer to its initial state.
 */
export function useCountdown(initialTime: number, shouldRun: boolean | (() => boolean)) {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if ((typeof shouldRun === 'boolean' && !shouldRun) || typeof shouldRun === 'function' && !shouldRun())
            return;
        const interval = setInterval(() => {
            setTimeLeft(time => (time > 0 ? time - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [shouldRun]);

    const resetCountdown = () => setTimeLeft(initialTime);

    return {
        timeLeft: formatTimeLeft(timeLeft),
        resetCountdown,
        isCountdownOver: timeLeft === 0,
        integerTimeLeft: Math.trunc(timeLeft)
    };
}
