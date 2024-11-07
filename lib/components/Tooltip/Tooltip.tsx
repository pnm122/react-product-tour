import { CSSProperties, PropsWithChildren, useLayoutEffect, useRef, useState } from "react"
import createClasses from "../../utils/createClasses"
import styles from './Tooltip.module.css'

export interface TooltipProps {
  on: string
  active: boolean
  position: 'top-left' | 'top-center' | 'top-right' | 'right-top' | 'right-center' | 'right-bottom' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'left-top' | 'left-center' | 'left-bottom'
  className?: string
  style?: CSSProperties
  clearDefaultStyles?: boolean
}

export default function Tooltip({
  on,
  active,
  position,
  className,
  style,
  clearDefaultStyles,
  children
}: PropsWithChildren<TooltipProps>) {
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

    window.addEventListener('scroll', calculatePosition)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', calculatePosition)
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

  function calculateTooltipPosition(pos: TooltipProps['position'], elem: HTMLElement) {
    // Must be kept aligned with CSS variables
    const arrowHalfWidth = 8
    const arrowLength = 8
    const arrowSideOffset = 4
    // ---------------------------------------
    const gapToElement = 2
    
    let x = 0
    let y = 0

    const onRect = elem.getBoundingClientRect()
    const tooltipRect = tooltip.current!.getBoundingClientRect()

    if(pos.startsWith('top')) {
      x = onRect.x + (onRect.width / 2)
      y = onRect.y - tooltipRect.height - arrowLength - gapToElement
    } else if(pos.startsWith('bottom')) {
      x = onRect.x + (onRect.width / 2)
      y = onRect.y + onRect.height + arrowLength + gapToElement
    } else if(pos.startsWith('right')) {
      x = onRect.x + onRect.width + arrowLength + gapToElement
      y = onRect.y + (onRect.height / 2)
    } else if(pos.startsWith('left')) {
      x = onRect.x - tooltipRect.width - arrowLength - gapToElement
      y = onRect.y + (onRect.height / 2)
    }

    if(['bottom-right', 'top-right'].includes(pos)) {
      x -= arrowSideOffset + arrowHalfWidth
    } else if(['bottom-center', 'top-center'].includes(pos)) {
      x -= tooltipRect.width / 2
    } else if(['bottom-left', 'top-left'].includes(pos)) {
      x -= tooltipRect.width - arrowSideOffset - arrowHalfWidth
    }

    if(['right-bottom', 'left-bottom'].includes(pos)) {
      y -= arrowSideOffset + arrowHalfWidth
    } else if(['right-center', 'left-center'].includes(pos)) {
      y -= tooltipRect.height / 2
    } else if(['right-top', 'left-top'].includes(pos)) {
      y -= tooltipRect.height - arrowSideOffset - arrowHalfWidth
    }

    return { x, y }
  }

  function updateTooltipPosition(pos: TooltipProps['position'], x: number, y: number) {
    setCalculatedPosition(pos)
    tooltip.current!.style.transform = `translate(${x}px, ${y}px)`
  }

  function calculatePosition() {
    if(!onElement.current || !active) {
      return
    }

    //    0 1 2
    //  9       3
    // 10       4
    // 11       5
    //    6 7 8
    const numberToPosition = {
      0: 'top-left',
      1: 'top-center',
      2: 'top-right',
      3: 'right-top',
      4: 'right-center',
      5: 'right-bottom',
      6: 'bottom-left',
      7: 'bottom-center',
      8: 'bottom-right',
      9: 'left-top',
      10: 'left-center',
      11: 'left-bottom'
    }
    // flip keys and values for efficient use in both directions
    const positionToNumber = Object.fromEntries(Object.entries(numberToPosition).map(e => [e[1], parseInt(e[0])]))

    // Create the order of positions to try based on a starting position
    // Positions are in form [orientation]-[alignment]
    // Try all alignments in the same orientation from closest to furthest from starting position
    // Try all alignments on the opposite orientation in the same order
    // Try all alignments counter-clockwise one rotation
    // Try all alignments clockwise one rotation
    function createOrder(position: TooltipProps['position']) {
      const start = positionToNumber[position]

      // function to add while keeping calculations within allowed values
      function add(n: number, i: number) {
        return (n + i) % 12
      }

      // Get the order within an orientation (i.e. the thing before the dash) based on the start number
      function orderWithinOrientation(start: number) {
        // maps to alignment of positions (i.e. the thing after the dash)
        // 0: left/top
        // 1: center
        // 2: right/bottom
        const alignment = start % 3

        return alignment === 0 ? [
          start,
          start + 1,
          start + 2
        ] : alignment === 1 ? [
          start,
          start - 1,
          start + 1
        ] : [
          start,
          start - 1,
          start - 2
        ]
      }

      function startOfOrientation(n: number) {
        return n - (n % 3)
      }

      return [
        ...orderWithinOrientation(start),
        ...orderWithinOrientation(add(start, 6)),
        ...orderWithinOrientation(startOfOrientation(add(start, 9))),
        ...orderWithinOrientation(startOfOrientation(add(start, 3)))
      ].map(n => numberToPosition[n as 0])
    }
    
    const order = createOrder(position)

    const tooltipRect = tooltip.current!.getBoundingClientRect()
    const foundWorkingPosition = !!order.find(positionToTry => {
      const { x, y } = calculateTooltipPosition(positionToTry as any, onElement.current!)

      const withinScreenX = x >= 0 && x + tooltipRect.width < window.innerWidth
      const withinScreenY = y >= 0 && y + tooltipRect.height < window.innerHeight

      if(withinScreenX && withinScreenY) {
        updateTooltipPosition(positionToTry as any, x, y)
        return true
      } else {
        return false
      }
    })

    // If all positions aren't working, display the tooltip with the default position
    if(!foundWorkingPosition) {
      const { x, y } = calculateTooltipPosition(position, onElement.current)
      updateTooltipPosition(position, x, y)
    }
  }

  return invalid ? <></> : (
    <div
      // @ts-ignore
      popover="manual"
      ref={tooltip}
      style={style}
      className={createClasses({
        [styles['tooltip']]: true,
        [styles['tooltip--default-styles']]: !clearDefaultStyles,
        [styles[`tooltip--${calculatedPosition}`]]: true,
        ...(className ? { [className]: true } : {})
      })}>
      {children}
    </div>
  )
}
