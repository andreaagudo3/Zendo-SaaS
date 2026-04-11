import React from 'react';

/**
 * Reusable Feature List component for Pricing Cards.
 */
export default function PricingFeatureList({ features, isHighlighted }) {
    const iconColorClass = isHighlighted ? 'text-blue-400' : 'text-slate-400';
    const textColorClass = isHighlighted ? 'text-slate-200' : 'text-slate-700';

    return (
        <ul className="space-y-4 text-sm leading-relaxed mb-10 w-full flex-grow">
            {features.map((feature, idx) => (
                <li key={idx} className={`flex items-start gap-3 ${textColorClass}`}>
                    <svg className={`w-5 h-5 shrink-0 mt-0.5 ${iconColorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={feature.bold ? 'font-semibold' : 'font-medium'}>
                        {feature.text}
                    </span>
                </li>
            ))}
        </ul>
    );
}
