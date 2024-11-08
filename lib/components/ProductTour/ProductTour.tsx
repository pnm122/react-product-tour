import { TooltipProps } from '../Tooltip/Tooltip'
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
	steps: {
		tooltipOn: string
		heading?: React.ReactNode
		body: React.ReactNode
		position: TooltipProps['position']
	}[]
	activeStep?: number
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
