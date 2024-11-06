import { PropsWithChildren, useLayoutEffect, useRef, useState } from "react"
import createClasses from "../../utils/createClasses"
import styles from './Tooltip.module.css'

interface Props {
  on: string
  active: boolean
  position: 'top-left' | 'top-center' | 'top-right' | 'right-top' | 'right-center' | 'right-bottom' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'left-top' | 'left-center' | 'left-bottom'
}

export default function Tooltip({
  on,
  active,
  position,
  children
}: PropsWithChildren<Props>) {
  const [invalid, setInvalid] = useState(false)
  const [calculatedPosition, setCalculatedPosition] = useState(position)
  const tooltip = useRef<HTMLDivElement>(null)
  const onElement = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    onElement.current = document.getElementById(on)
    if(!onElement.current) {
      console.warn('Invalid Tooltip target element id:', `#${on}`)
      setInvalid(true)
      return
    }

    const observer = new ResizeObserver(() => {
      calculatePosition()
    })

    observer.observe(document.body)

    return () => {
      observer.disconnect()
    }
  })

  useLayoutEffect(() => {
    if(active) {
      calculatePosition()
      tooltip.current?.showPopover()
    } else {
      tooltip.current?.hidePopover()
    }
  }, [active, position])

  function calculatePosition() {
    if(!onElement.current) {
      return
    }

    const onRect = onElement.current.getBoundingClientRect()
    const tooltipRect = tooltip.current!.getBoundingClientRect()

    // Must be kept aligned with CSS variables
    const arrowHalfWidth = 8
    const arrowLength = 8
    const arrowSideOffset = 4
    // ---------------------------------------
    const gapToElement = 2
    
    let x = 0
    let y = 0

    if(calculatedPosition.startsWith('top')) {
      x = onRect.x + (onRect.width / 2)
      y = onRect.y - tooltipRect.height - arrowLength - gapToElement
    } else if(calculatedPosition.startsWith('bottom')) {
      x = onRect.x + (onRect.width / 2)
      y = onRect.y + onRect.height + arrowLength + gapToElement
    } else if(calculatedPosition.startsWith('right')) {
      x = onRect.x + onRect.width + arrowLength + gapToElement
      y = onRect.y + (onRect.height / 2)
    } else if(calculatedPosition.startsWith('left')) {
      x = onRect.x - tooltipRect.width - arrowLength - gapToElement
      y = onRect.y + (onRect.height / 2)
    }

    if(['bottom-right', 'top-right'].includes(calculatedPosition)) {
      x -= arrowSideOffset + arrowHalfWidth
    } else if(['bottom-center', 'top-center'].includes(calculatedPosition)) {
      x -= tooltipRect.width / 2
    } else if(['bottom-left', 'top-left'].includes(calculatedPosition)) {
      x -= tooltipRect.width - arrowSideOffset - arrowHalfWidth
    }

    if(['right-bottom', 'left-bottom'].includes(calculatedPosition)) {
      y -= arrowSideOffset + arrowHalfWidth
    } else if(['right-center', 'left-center'].includes(calculatedPosition)) {
      y -= tooltipRect.height / 2
    } else if(['right-top', 'left-top'].includes(calculatedPosition)) {
      y -= tooltipRect.height - arrowSideOffset - arrowHalfWidth
    }

    tooltip.current!.style.transform = `translate(${x}px, ${y}px)`
  }

  return invalid ? <></> : (
    <div
      // @ts-ignore
      popover="manual"
      ref={tooltip}
      className={createClasses({
        [styles['tooltip']]: true,
        [styles[`tooltip--${calculatedPosition}`]]: true
      })}>
      {children}
    </div>
  )
}
