'use client'

import { useState } from 'react'
import { ArrowIcon } from './icons'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div className="w-full max-w-md">
      <p className="brand-subtitle text-4xl text-coral md:text-5xl">
        Cartas desde el atardecer
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Historias, nuevas piezas y momentos de la casa. Sin ruido, solo aquello
        que merece ser contado.
      </p>

      {sent ? (
        <p className="mt-6 text-sm font-medium text-coral" role="status">
          Gracias. Te escribiremos pronto.
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (email.trim()) setSent(true)
          }}
          className="mt-6 flex items-center gap-3 border-b border-ink/25 pb-2"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Tu correo electrónico
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink/45 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Suscribirse"
            className="text-coral transition-colors duration-500 hover:text-lavender"
          >
            <ArrowIcon className="size-5" />
          </button>
        </form>
      )}
    </div>
  )
}
