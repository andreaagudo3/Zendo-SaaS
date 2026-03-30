/**
 * PropertyDescription.jsx — Renderiza las descripciones preservando saltos de línea (\n).
 */
export function PropertyDescription({ text, className = '' }) {
  if (!text) return null
  
  return (
    <p className={`whitespace-pre-line text-secondary-700 leading-relaxed ${className}`}>
      {text}
    </p>
  )
}
