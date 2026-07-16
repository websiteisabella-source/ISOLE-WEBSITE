'use client'

import { motion } from 'motion/react'
import { SITE_NAME, whatsappLink } from '@/lib/site'
import { WhatsAppIcon } from './icons'

export function WhatsAppFloat() {
  return (
    <motion.a
      href={whatsappLink(
        `Hola ${SITE_NAME}, me gustaría conocer más sobre sus piezas.`,
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.8, duration: 0.6 }}
      whileHover={{ scale: 1.06 }}
      className="fixed bottom-5 right-5 z-40 flex items-center justify-center rounded-full bg-coral text-primary-foreground shadow-lg shadow-coral/30 md:bottom-8 md:right-8"
      style={{ width: '3.25rem', height: '3.25rem' }}
    >
      <WhatsAppIcon className="size-6" />
    </motion.a>
  )
}
