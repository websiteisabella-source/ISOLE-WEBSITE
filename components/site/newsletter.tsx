'use client'

import { useState } from 'react'
import { ArrowIcon } from './icons'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div className="w-full max-w-md">
      <p className="font-serif text-2xl text-cream md:text-3xl">
        Cartas desde el atardecer
      </p>
      <p className="mt-3 text-sm leading-relaxed text-cream/70">
        Historias, nuevas piezas y momentos de la casa. Sin ruido, solo aquello
        que merece ser contado.
      </p>

      {sent ? (
        <p className="mt-6 text-sm text-petal" role="status">
          Gracias. Te escribiremos pronto.
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (email.trim()) setSent(true)
          }}
          className="mt-6 flex items-center gap-3 border-b border-cream/30 pb-2"
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
            className="w-full bg-transparent text-sm text-cream placeholder:text-cream/40 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Suscribirse"
            className="text-cream transition-colors duration-500 hover:text-coral"
          >
            <ArrowIcon className="size-5" />
          </button>
        </form>
      )}
    </div>
  )
}
