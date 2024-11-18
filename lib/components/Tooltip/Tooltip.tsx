import { PropsWithChildren, useCallback, useLayoutEffect, useRef, useState } from 'react'
import createClasses from '../../utils/createClasses'
import styles from './Tooltip.module.css'
import { calculateBoundedTooltipPosition, TooltipPosition } from '../../utils/tooltip'

export interface TooltipProps {
	/** Selector of the element to attach this tooltip to */
	on: string
	/** Whether this tooltip is visible */
	active: boolean
	/** The preferred position for this tooltip. It will change positions to fit on-screen if the preferred position doesn't fit. */
	position: TooltipPosition
	/** Class(es) to add to the tooltip container */
	className?: string
	/** Inline CSS to add to the tooltip container */
	style?: React.CSSProperties
	/** Whether to remove the default styling of the tooltip */
	clearDefaultStyles?: boolean
	/** A label on the tooltip for screen readers. Should be used when the tooltip content needs context that can otherwise only be seen. */
	ariaLabel?: string
	/** A role to add to the tooltip. Can be used to give screen readers additional context and/or force the content to be read when opened. */
	role?: React.AriaRole
}

let frame: number
let lastOnElementPosition = { x: 0, y: 0 }

export default function Tooltip({
	on,
	active,
	position,
	className,
	style,
	clearDefaultStyles,
	ariaLabel,
	role,
	children
}: PropsWithChildren<TooltipProps>) {
	const [calculatedPosition, setCalculatedPosition] = useState(position)
	const tooltip = useRef<HTMLDivElement>(null)
	const onElement = useRef<HTMLElement | null>(null)

	function updateTooltipPosition(pos: TooltipPosition, x: number, y: number) {
		setCalculatedPosition(pos)
		tooltip.current!.style.transform = `translate(${x}px, ${y}px)`
	}

	const calculatePosition = useCallback(() => {
		if (!onElement.current) {
			frame = requestAnimationFrame(calculatePosition)
			return
		}

		const { x: onX, y: onY } = onElement.current.getBoundingClientRect()
		if (onX !== lastOnElementPosition.x || onY !== lastOnElementPosition.y) {
			const { x, y, finalPosition } = calculateBoundedTooltipPosition(
				tooltip.current!,
				onElement.current!,
				position
			)

			updateTooltipPosition(finalPosition, x, y)
			lastOnElementPosition = { x: onX, y: onY }
		}

		frame = requestAnimationFrame(calculatePosition)
	}, [active, position])

	useLayoutEffect(() => {
		onElement.current = document.querySelector(on)
		if (!onElement.current) {
			console.warn('Invalid Tooltip target selector:', `${on}`)
			return
		}
	}, [on])

	useLayoutEffect(() => {
		if (active) {
			tooltip.current?.showPopover()
			calculatePosition()
		} else {
			cancelAnimationFrame(frame)
			tooltip.current?.hidePopover()
		}

		return () => {
			cancelAnimationFrame(frame)
		}
	}, [active, position, calculatePosition])

	return (
		<div
			// @ts-expect-error "popover" is not a known attribute in JSX yet, but it is valid. Can safely remove this once it's known.
			popover="manual"
			role={role}
			aria-label={ariaLabel}
			ref={tooltip}
			style={style}
			className={createClasses({
				[styles['tooltip']]: true,
				[styles['tooltip--default-styles']]: !clearDefaultStyles,
				[styles[`tooltip--${calculatedPosition}`]]: true,
				...(className ? { [className]: true } : {})
			})}
		>
			{children}
		</div>
	)
}
