import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import VeilLogo from './Icon/VeilLogo'
import Button from './UI/Button'
import { version } from '../../package.json'

interface Props {
  onStart?(): void
}

const Welcome = ({ onStart }: Props) => {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsRevealed(true), 1000)
    return () => {
      clearTimeout(timeout)
    }
  })

  const handleClick = () => {
    setIsSubmitted(true)
    onStart && onStart()
  }

  return (
    <div className="m-auto max-w-sm text-center pb-12">
      <motion.div
        animate={{
          y: isRevealed ? 0 : 150,
          scale: isRevealed ? 1 : 1.5,
          rotateY: 360,
        }}
        transition={{ duration: 0.5 }}
        initial={{ scale: 0, y: 150, rotateY: 0 }}
      >
        <VeilLogo className="mx-auto" />
      </motion.div>
      <motion.div animate={{ opacity: isRevealed ? 1 : 0 }} initial={false}>
        <h1 className="mt-8 leading-none text-4xl font-extrabold">
          Welcome to Veil X.
        </h1>
        <p className="mt-2 mb-8 text-2xl leading-snug text-gray-300">
          A reimagined wallet experience for the pioneering privacy coin.
        </p>
        <motion.div
          className="overflow-hidden"
          animate={{
            height: isSubmitted ? 0 : '5rem',
            opacity: isSubmitted ? 0 : 1,
          }}
          initial={false}
        >
          <Button primary size="xl" onClick={handleClick}>
            Get Started
          </Button>
        </motion.div>

        <ul className="text-center text-sm leading-none text-gray-400">
          <li>
            <a
              href=""
              className="underline hover:text-white hover:no-underline"
            >
              Read the launch announcement
            </a>
          </li>
          <li className="mt-3">
            <a
              href=""
              className="underline hover:text-white hover:no-underline"
            >
              Learn more about Veil
            </a>
          </li>
        </ul>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 text-gray-400 text-sm pb-6">
        Veil X {version}
      </div>
    </div>
  )
}

export default Welcome
