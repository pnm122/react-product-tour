import createClasses from '../../utils/createClasses'
import Tooltip, { TooltipProps } from '../Tooltip/Tooltip'
import styles from './ProductTourTooltip.module.css'

export type ProductTourTooltipProps = Omit<TooltipProps, 'ariaLabel' | 'ariaLive' | 'role'> & {
	/** Optional heading to appear above all other content in the tooltip */
	heading?: React.ReactNode
	/** Main content of the tooltip */
	body: React.ReactNode
	/** Step position in the tour. Starts from 0 */
	n: number
	/** Number of steps in the tour */
	tourLength: number
	/** Name of this product tour, read to screen readers */
	name: string
	/** Callback for when the 'Next' button is clicked */
	onNextClicked?: () => void
	/** Callback for when the 'Skip tour' button is clicked */
	onSkipClicked?: () => void
	/** Callback for when the 'Finish' button is clicked */
	onFinishClicked?: () => void
	/** Whether to hide the 'Next' button */
	hideNextButton?: boolean
	/** Whether to hide the 'Skip tour' button */
	hideSkipButton?: boolean
	/** Whether to hide the 'Finish' button */
	hideFinishButton?: boolean
	/** Class(es) to add to the 'Next' button */
	nextButtonClassName?: string
	/** Class(es) to add to the 'Skip tour' button */
	skipButtonClassName?: string
	/** Class(es) to add to the 'Finish' button */
	finishButtonClassName?: string
	/** Whether to remove the default styling of the buttons */
	clearButtonStyles?: boolean
	/**
	 * Text to use for the 'Next' button
	 * @default "Next"
	 */
	nextText?: string
	/**
	 * Text to use for the 'Skip tour' button
	 * @default "Skip tour"
	 */
	skipText?: string
	/**
	 * Text to use for the 'Finish' button
	 * @default "Finish"
	 */
	finishText?: string
}

export default function ProductTourTooltip({
	heading,
	body,
	n,
	tourLength,
	name,
	onNextClicked,
	onSkipClicked,
	onFinishClicked,
	hideNextButton,
	hideFinishButton,
	hideSkipButton,
	nextButtonClassName,
	skipButtonClassName,
	finishButtonClassName,
	clearButtonStyles,
	nextText,
	skipText,
	finishText,
	className,
	...props
}: ProductTourTooltipProps) {
	const locationRangeStart =
		tourLength <= 5 || n <= 2 ? 0 : n >= tourLength - 2 ? tourLength - 5 : n - 2

	return (
		<Tooltip
			className={createClasses({
				...(className ? { [className]: true } : {}),
				...(props.clearDefaultStyles ? {} : { [styles['tooltip']]: true })
			})}
			ariaLabel={`${name}: Step ${n + 1} of ${tourLength}`}
			// Other roles don't seem to be read aloud?
			// Ideally this should be polite alerting, but it doesn't seem to work
			role="alert"
			{...props}
		>
			{heading && <h1 className={styles['tooltip__heading']}>{heading}</h1>}
			<p className={styles['tooltip__body']}>{body}</p>
			<div className={styles['tooltip__bottom']}>
				<div className={styles['tour-location']}>
					<ul className={styles['tour-location__dots']}>
						{new Array(Math.min(5, tourLength)).fill(0).map((_, dotIndex) => {
							const adjustedIndex = locationRangeStart + dotIndex
							const isSelected = adjustedIndex === n
							const dotsToLeft = locationRangeStart
							const dotsToRight = Math.max(0, tourLength - (locationRangeStart + 5))
							const isSmall =
								(dotsToLeft === 1 && dotIndex === 0) ||
								(dotsToLeft >= 2 && dotIndex === 1) ||
								(dotsToRight === 1 && dotIndex === 4) ||
								(dotsToRight >= 2 && dotIndex === 3)
							const isExtraSmall =
								(dotsToLeft >= 2 && dotIndex === 0) || (dotsToRight >= 2 && dotIndex === 4)

							return (
								<li
									key={adjustedIndex}
									className={createClasses({
										[styles['tour-location__dot']]: true,
										[styles['tour-location__dot--selected']]: isSelected,
										[styles['tour-location__dot--small']]: isSmall,
										[styles['tour-location__dot--extra-small']]: isExtraSmall
									})}
								/>
							)
						})}
					</ul>
					<span aria-hidden="true" className={styles['tour-location__number']}>
						{n + 1}/{tourLength}
					</span>
				</div>
				<div className={styles['buttons']}>
					{!hideNextButton && n !== tourLength - 1 && (
						<button
							className={createClasses({
								[styles['button--primary']]: !clearButtonStyles,
								...(nextButtonClassName ? { [nextButtonClassName]: true } : {})
							})}
							onClick={() => onNextClicked && onNextClicked()}
						>
							{nextText ?? 'Next'}
						</button>
					)}
					{!hideFinishButton && n === tourLength - 1 && (
						<button
							className={createClasses({
								[styles['button--primary']]: !clearButtonStyles,
								...(finishButtonClassName ? { [finishButtonClassName]: true } : {})
							})}
							onClick={() => onFinishClicked && onFinishClicked()}
						>
							{finishText ?? 'Finish'}
						</button>
					)}
					{!hideSkipButton && n !== tourLength - 1 && (
						<button
							className={createClasses({
								[styles['button--secondary']]: !clearButtonStyles,
								...(skipButtonClassName ? { [skipButtonClassName]: true } : {})
							})}
							onClick={() => onSkipClicked && onSkipClicked()}
						>
							{skipText ?? 'Skip tour'}
						</button>
					)}
				</div>
			</div>
		</Tooltip>
	)
}
