'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import {
  INSTAGRAM_URL,
  SITE_NAME,
  WHATSAPP_NUMBER,
  whatsappLink,
} from '@/lib/site'
import { CloseIcon, InstagramIcon, PhoneIcon, WhatsAppIcon } from './icons'

export function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false)
  const whatsappHref = whatsappLink(
    `Hola ${SITE_NAME}, me gustaria conocer mas sobre sus piezas.`,
  )
  const phoneHref = `tel:+${WHATSAPP_NUMBER}`
  const contactOptions = [
    {
      label: 'WhatsApp',
      href: whatsappHref,
      icon: WhatsAppIcon,
      external: true,
    },
    {
      label: 'Llamar',
      href: phoneHref,
      icon: PhoneIcon,
      external: false,
    },
    {
      label: 'Instagram',
      href: INSTAGRAM_URL,
      icon: InstagramIcon,
      external: true,
    },
  ]

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.8, duration: 0.6 }}
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 md:bottom-8 md:right-8"
    >
      <motion.div
        aria-hidden={!isOpen}
        className={`flex flex-col items-end gap-2 ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={{
          open: {
            opacity: 1,
            transition: { staggerChildren: 0.05, staggerDirection: -1 },
          },
          closed: {
            opacity: 0,
            transition: { staggerChildren: 0.04 },
          },
        }}
      >
        {contactOptions.map((option) => {
          const Icon = option.icon

          return (
            <motion.a
              key={option.label}
              href={option.href}
              target={option.external ? '_blank' : undefined}
              rel={option.external ? 'noopener noreferrer' : undefined}
              aria-label={option.label}
              title={option.label}
              tabIndex={isOpen ? 0 : -1}
              variants={{
                open: { opacity: 1, y: 0, scale: 1 },
                closed: { opacity: 0, y: 12, scale: 0.9 },
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="flex size-[3.25rem] items-center justify-center rounded-full border border-cream/45 bg-cream text-ink shadow-lg shadow-ink/15 transition-colors duration-300 hover:bg-coral hover:text-primary-foreground"
            >
              <Icon className="size-6" />
            </motion.a>
          )
        })}
      </motion.div>

      <motion.button
        type="button"
        aria-label={isOpen ? 'Cerrar menu de contacto' : 'Abrir menu de contacto'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center justify-center rounded-full bg-coral text-primary-foreground shadow-lg shadow-coral/30 transition-colors duration-300 hover:bg-lavender"
        style={{ width: '3.25rem', height: '3.25rem' }}
      >
        {isOpen ? (
          <CloseIcon className="size-6" />
        ) : (
          <img
            src="/images/contact-float-isologo.png"
            alt=""
            aria-hidden="true"
            className="object-contain brightness-0 invert"
            style={{ width: '2.625rem', height: '2.625rem' }}
          />
        )}
      </motion.button>
    </motion.div>
  )
}
