import { memo, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
const Portal = ({ id, children }: any) => {
  const el = useRef(
    document.getElementById(id) || document.createElement('div')
  )
  const [dynamic] = useState(!el.current.parentElement)

  useEffect(() => {
    const currentEl = el.current
    if (dynamic) {
      currentEl.id = id
      document.body.appendChild(currentEl)
    }
    return () => {
      if (dynamic && currentEl.parentElement) {
        currentEl.parentElement.removeChild(currentEl)
      }
    }
  }, [id, dynamic])

  return createPortal(children, el.current)
}
export default memo(Portal)
