import React from 'react';
import { useTranslation } from 'react-i18next';
import PricingFeatureList from './PricingFeatureList';
import PricingCTA from './PricingCTA';

/**
 * Reusable Card component for individual SaaS plans.
 */
export default function PricingCard({ plan }) {
    const { t } = useTranslation(['marketing']);
    const {
        title,
        badge,
        setupFee,
        monthlyFee,
        description,
        features,
        ctaText,
        isHighlighted,
        className = ''
    } = plan;

    // Base styling
    const baseCardClass = "rounded-3xl p-8 flex flex-col h-full";
    const highlightCardClass = isHighlighted 
        ? "bg-slate-950 shadow-2xl relative lg:-translate-y-8 border-4 border-blue-500 ring-8 ring-blue-500/10 text-white" 
        : "bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300";

    return (
        <div className={`${baseCardClass} ${highlightCardClass} ${className}`}>
            {/* Badge Highlight (e.g. Most Popular) */}
            {isHighlighted && badge && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest leading-relaxed">
                    {badge}
                </div>
            )}
            {!isHighlighted && badge && (
                <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">
                    {badge}
                </div>
            )}

            {/* Title */}
            <h3 className={`text-2xl font-bold mb-2 ${isHighlighted ? 'text-white' : 'text-slate-900'}`}>
                {title}
            </h3>

            {/* Pricing */}
            <div className="mb-2 flex items-baseline gap-1">
                <span className={`text-3xl lg:text-4xl font-extrabold ${isHighlighted ? 'text-white' : 'text-slate-950'}`}>
                    {setupFee}
                </span>
                <span className={`text-sm font-medium ${isHighlighted ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t('marketing:pricing.setup', 'setup')}
                </span>
            </div>
            
            <div className={`mb-4 pb-4 border-b font-semibold flex items-baseline gap-1 ${isHighlighted ? 'border-white/10' : 'border-slate-100'}`}>
                <span className={`text-xl lg:text-2xl font-bold ${isHighlighted ? 'text-white' : 'text-slate-950'}`}>
                    {monthlyFee}
                </span>
                <span className={`text-sm ${isHighlighted ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t('marketing:pricing.monthly', '/ month')}
                </span>
            </div>

            {/* Description */}
            <p className={`text-sm md:text-base leading-relaxed mb-8 flex-grow ${isHighlighted ? 'text-slate-300' : 'text-slate-600'}`}>
                {description}
            </p>

            {/* Features */}
            <PricingFeatureList 
                features={features} 
                isHighlighted={isHighlighted} 
            />

            {/* Call to Action */}
            <div className="mt-auto pt-6">
                <PricingCTA 
                    text={ctaText} 
                    isHighlighted={isHighlighted} 
                />
            </div>
        </div>
    );
}
