import { useEffect, useState } from 'react';

interface CountdownTimerProps {
    targetDate: string;
    labelClassName?: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function CountdownTimer({ targetDate, labelClassName = "text-gray-600" }: CountdownTimerProps) {
    const calculateTimeLeft = (): TimeLeft => {
        const difference = +new Date(targetDate) - +new Date();

        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const formatNumber = (num: number) => String(num).padStart(2, '0');

    return (
        <div className="flex justify-center gap-4">
            <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-[#14B8A6] to-[#0d9488] text-2xl font-bold text-white shadow-lg">
                    {formatNumber(timeLeft.days)}
                </div>
                <span className={`mt-2 text-xs font-medium ${labelClassName}`}>
                    Days
                </span>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-[#14B8A6] to-[#0d9488] text-2xl font-bold text-white shadow-lg">
                    {formatNumber(timeLeft.hours)}
                </div>
                <span className={`mt-2 text-xs font-medium ${labelClassName}`}>
                    Hours
                </span>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-[#14B8A6] to-[#0d9488] text-2xl font-bold text-white shadow-lg">
                    {formatNumber(timeLeft.minutes)}
                </div>
                <span className={`mt-2 text-xs font-medium ${labelClassName}`}>
                    Minutes
                </span>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-[#14B8A6] to-[#0d9488] text-2xl font-bold text-white shadow-lg">
                    {formatNumber(timeLeft.seconds)}
                </div>
                <span className={`mt-2 text-xs font-medium ${labelClassName}`}>
                    Seconds
                </span>
            </div>
        </div>
    );
}
