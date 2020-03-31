import React, { MouseEvent, AnchorHTMLAttributes } from 'react'
import { useStore } from 'store'

const ExternalLink = ({
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const { effects } = useStore()
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    href && effects.electron.openExternalLink(href)
  }
  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}

export default ExternalLink
