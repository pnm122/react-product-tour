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
  const tooltip = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const onElement = document.getElementById(on)
    if(!onElement) {
      setInvalid(true)
      return
    }

    const observer = new ResizeObserver((entries) => {
      // console.log(entries[0])
    })

    observer.observe(document.body)

    return () => {
      observer.disconnect()
    }
  })

  useLayoutEffect(() => {
    if(active) {
      tooltip.current?.showPopover()
    } else {
      tooltip.current?.hidePopover()
    }
  }, [active])

  return invalid ? <></> : (
    <div
      // @ts-ignore
      popover="manual"
      ref={tooltip}
      className={createClasses({
        [styles['tooltip']]: true,
        [styles[`tooltip--${position}`]]: true
      })}>
      {children}
    </div>
  )
}
