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
	steps: {
		/** Selector of the element to attach this tooltip to */
		tooltipOn: ProductTourTooltipProps['on']
		/** Optional heading to appear above all other content in the tooltip */
		heading?: ProductTourTooltipProps['heading']
		/** Main content of the tooltip */
		body: ProductTourTooltipProps['body']
		/** The preferred position for this tooltip. It will change positions to fit on-screen if the preferred position doesn't fit. */
		position: ProductTourTooltipProps['position']
	}[]
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
			{steps.map(({ tooltipOn, heading, body, position }, index) => (
				<ProductTourTooltip
					{...tooltipProps}
					key={index}
					active={index === activeStep}
					heading={heading}
					body={body}
					on={tooltipOn}
					position={position}
					n={index}
					tourLength={steps.length}
					className={tooltipClassName}
				/>
			))}
		</>
	)
}
