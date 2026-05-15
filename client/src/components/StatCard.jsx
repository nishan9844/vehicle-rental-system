import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const StatCard = ({ title, value, trend, trendValue, icon: Icon, iconBg, subValue }) => {
    const isPositive = trend === 'up';

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 group shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-xl", iconBg)}>
                    <Icon size={24} className="text-white" />
                </div>
                <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold",
                    isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                )}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {trendValue}
                </div>
            </div>

            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
                {subValue && (
                    <div className="flex flex-col gap-2">
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                        <p className="text-[11px] text-gray-500">{subValue}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
