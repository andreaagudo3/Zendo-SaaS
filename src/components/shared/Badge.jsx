import { Link } from 'react-router-dom'

/**
 * Badge — small pill label for property type or featured status.
 * @param {{ label: string, variant?: 'sale'|'rent'|'featured'|'reserved'|'sold'|'default' }} props
 */
export function Badge({ label, variant = 'default' }) {
  const variants = {
    sale: 'bg-primary-700 text-white',
    rent: 'bg-emerald-500 text-white',
    featured: 'bg-amber-400 text-amber-900',
    reserved: 'bg-amber-500 text-white',
    sold: 'bg-red-600 text-white',
    default: 'bg-secondary-200 text-secondary-700',
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase ${variants[variant]}`}
    >
      {label}
    </span>
  )
}
