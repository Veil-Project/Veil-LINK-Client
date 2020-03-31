import React, { useState } from 'react'
import useInterval from 'hooks/useInterval'

const FEATURES = [
  {
    title: 'Veil is user-focused',
    description:
      'In a digital cash society, participation extends to everybody, not just those who read user manuals. Veil has one of the most user-friendly wallets in crypto.',
  },
  {
    title: 'Veil is self-sustaining',
    description:
      'The Veil network includes built-in self-funding for project development, operations, customer support, and ongoing research and development.',
  },
  {
    title: 'Veil is fair',
    description:
      "No ICO. No premine. Veil's blockchain is secured via Proof-of-Work and Proof-of-Stake in order to combine both security and fair distribution.",
  },
  {
    title: 'Veil is future-safe',
    description:
      'Veil will continue to push the limits of cryptography and blockchain technology through Veil Labs, an entity dedicated to R&D and partnerships with leading academic institutions.',
  },
]

const FeatureSlider = () => {
  const [slide, setSlide] = useState(0)

  useInterval(() => {
    let nextSlide
    if (slide === FEATURES.length - 1) {
      nextSlide = 0
    } else {
      nextSlide = slide + 1
    }
    setSlide(nextSlide)
  }, 5000)

  const currentSlide = FEATURES[slide]

  return (
    <div className="mb-6 text-base text-gray-300">
      <h3 className="text-teal-500 uppercase tracking-wider text-sm font-bold">
        {currentSlide.title}
      </h3>
      <p className="mt-2">{currentSlide.description}</p>
    </div>
  )
}

export default FeatureSlider
