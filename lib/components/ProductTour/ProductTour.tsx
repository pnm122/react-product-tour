import ProductTourTooltip, {
	ProductTourTooltipProps
} from '../ProductTourTooltip/ProductTourTooltip'

export type ProductTourProps = Pick<
	ProductTourTooltipProps,
	| 'onNextClicked'
	| 'onSkipClicked'
	| 'onFinishClicked'
	| 'hideNextButton'
	| 'hideFinishButton'
	| 'hideSkipButton'
	| 'nextButtonClassName'
	| 'finishButtonClassName'
	| 'skipButtonClassName'
	| 'clearButtonStyles'
	| 'clearDefaultStyles'
	| 'nextText'
	| 'skipText'
	| 'finishText'
	| 'name'
> & {
	/** Steps of the tour in the order that they are meant to appear */
	steps: Pick<ProductTourTooltipProps, 'on' | 'heading' | 'body' | 'position'>[]
	/** Step of the tour that is currently visible. Set to undefined/a number outside of the accepted range to hide the tour */
	activeStep?: number
	/** Class(es) to add to all tooltips */
	tooltipClassName?: string
}

export default function ProductTour({
	steps,
	activeStep,
	tooltipClassName,
	...tooltipProps
}: ProductTourProps) {
	return (
		<>
			{steps.map(({ on, heading, body, position }, index) => (
				<ProductTourTooltip
					{...tooltipProps}
					key={index}
					active={index === activeStep}
					heading={heading}
					body={body}
					on={on}
					position={position}
					n={index}
					tourLength={steps.length}
					className={tooltipClassName}
				/>
			))}
		</>
	)
}
