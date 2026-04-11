import React from 'react';
import { useTranslation } from 'react-i18next';
import PricingCard from './PricingCard';

export default function PricingSection() {
    const { t } = useTranslation(['marketing']);

    const PRICING_PLANS = [
        {
            title: t('marketing:pricing.starter.title', 'Starter'),
            badge: t('marketing:pricing.starter.badge', 'Start attracting clients'),
            setupFee: t('marketing:pricing.starter.setupFee', '1.200€'),
            monthlyFee: t('marketing:pricing.starter.monthlyFee', '99€'),
            description: t('marketing:pricing.starter.desc', 'Your first professional website to start attracting clients without relying on portals.'),
            ctaText: t('marketing:pricing.cta.getStarted', 'Get Started'),
            isHighlighted: false,
            features: [
                { text: t('marketing:pricing.starter.f1', 'Up to 30 properties'), bold: false },
                { text: t('marketing:pricing.starter.f2', 'Mobile-optimized website'), bold: false },
                { text: t('marketing:pricing.starter.f3', 'Simple admin panel'), bold: false },
                { text: t('marketing:pricing.starter.f4', 'Contact via email'), bold: false },
                { text: t('marketing:pricing.starter.f5', 'Basic filters (price, type, location)'), bold: false },
                { text: t('marketing:pricing.starter.f6', '1 language'), bold: false },
                { text: t('marketing:pricing.starter.f7', '1 fixed design'), bold: false },
                { text: t('marketing:pricing.starter.f8', 'Hosting & maintenance included'), bold: false }
            ]
        },
        {
            title: t('marketing:pricing.growth.title', 'Growth'),
            badge: t('marketing:pricing.growth.badge', 'Most Popular'),
            setupFee: t('marketing:pricing.growth.setupFee', '2.400€'),
            monthlyFee: t('marketing:pricing.growth.monthlyFee', '199€'),
            description: t('marketing:pricing.growth.desc', 'A system designed to convert visitors into real leads automatically.'),
            ctaText: t('marketing:pricing.cta.boost', 'Boost My Business'),
            isHighlighted: true,
            features: [
                { text: t('marketing:pricing.growth.f1', 'Up to 120 properties'), bold: false },
                { text: t('marketing:pricing.growth.f2', 'Everything in Starter +'), bold: true },
                { text: t('marketing:pricing.growth.f3', 'Contact via Email + WhatsApp'), bold: false },
                { text: t('marketing:pricing.growth.f4', '2 languages'), bold: false },
                { text: t('marketing:pricing.growth.f5', 'Google Maps integration'), bold: false },
                { text: t('marketing:pricing.growth.f6', 'Advanced filters (rooms, m², status)'), bold: false },
                { text: t('marketing:pricing.growth.f7', 'Choose between 3 UI themes'), bold: false },
                { text: t('marketing:pricing.growth.f8', 'SEO optimized structure'), bold: false }
            ]
        },
        {
            title: t('marketing:pricing.pro.title', 'Pro'),
            badge: t('marketing:pricing.pro.badge', 'Scale your business'),
            setupFee: t('marketing:pricing.pro.setupFee', 'Desde 3.900€'),
            monthlyFee: t('marketing:pricing.pro.monthlyFee', '299€'),
            description: t('marketing:pricing.pro.desc', 'A complete platform to scale your agency with advanced features and flexibility.'),
            ctaText: t('marketing:pricing.cta.sales', 'Talk to Sales'),
            isHighlighted: false,
            features: [
                { text: t('marketing:pricing.pro.f1', 'Up to 500 properties'), bold: false },
                { text: t('marketing:pricing.pro.f2', 'Everything in Growth +'), bold: true },
                { text: t('marketing:pricing.pro.f3', 'Multi-language (up to 4)'), bold: false },
                { text: t('marketing:pricing.pro.f4', 'Full contact system (forms + WhatsApp + tracking)'), bold: false },
                { text: t('marketing:pricing.pro.f5', 'Priority support'), bold: false },
                { text: t('marketing:pricing.pro.f6', 'Advanced customization'), bold: false },
                { text: t('marketing:pricing.pro.f7', 'Ready for paid ads (Meta / Google)'), bold: false }
            ]
        }
    ];

    return (
        <section id="pricing" className="py-20 bg-slate-50 relative border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Global Value Block */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-950 mb-8 tracking-tight">{t('marketing:pricing.title', 'Your Real Estate System')}</h2>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-4xl mx-auto mb-25">
                        {/* Value Bullet 1 */}
                        <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </span>
                            <span className="text-slate-700 font-medium whitespace-nowrap">{t('marketing:pricing.value1', 'Website ready in 7 days')}</span>
                        </div>

                        {/* Value Bullet 2 */}
                        <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </span>
                            <span className="text-slate-700 font-medium whitespace-nowrap">{t('marketing:pricing.value2', 'No WordPress headaches')}</span>
                        </div>

                        {/* Value Bullet 3 */}
                        <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </span>
                            <span className="text-slate-700 font-medium whitespace-nowrap">{t('marketing:pricing.value3', 'Easy admin panel')}</span>
                        </div>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch relative">
                    {PRICING_PLANS.map((plan, idx) => (
                        <div key={idx} className={plan.isHighlighted ? "lg:-translate-y-4" : ""}>
                            <PricingCard plan={plan} />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
