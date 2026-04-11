import React from 'react';

/**
 * Reusable CTA component for Pricing Cards.
 * Adapts its style based on whether it is highlighted.
 */
export default function PricingCTA({ text, isHighlighted, href = '#' }) {
    if (isHighlighted) {
        return (
            <a 
                href={href}
                className="block w-full py-4 px-6 text-center bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
            >
                {text}
            </a>
        );
    }

    return (
        <a 
            href={href}
            className="block w-full py-4 px-6 text-center border-2 border-slate-900 text-slate-900 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all shadow-sm"
        >
            {text}
        </a>
    );
}
