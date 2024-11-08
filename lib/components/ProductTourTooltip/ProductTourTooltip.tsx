import createClasses from '../../utils/createClasses'
import Tooltip, { TooltipProps } from '../Tooltip/Tooltip'
import styles from './ProductTourTooltip.module.css'

type Props = TooltipProps & {
  heading?: React.ReactNode
  body: React.ReactNode
  n: number
  tourLength: number
  onNextClicked?: () => void
  onSkipClicked?: () => void
  onFinishClicked?: () => void
  hideNextButton?: boolean
  hideFinishButton?: boolean
  nextButtonClassName?: string
  skipButtonClassName?: string
  finishButtonClassName?: string
  clearButtonStyles?: boolean
  nextText?: string
  skipText?: string
  finishText?: string
}

export default function ProductTourTooltip({
  heading,
  body,
  n,
  tourLength,
  onNextClicked,
  onSkipClicked,
  onFinishClicked,
  hideNextButton,
  hideFinishButton,
  nextButtonClassName,
  skipButtonClassName,
  finishButtonClassName,
  clearButtonStyles,
  nextText,
  skipText,
  finishText,
  className,
  ...props
}: Props) {
  const locationRangeStart = tourLength <= 5 || n <= 2
    ? 0
    : n >= tourLength - 2
      ? tourLength - 5
      : n - 2

  return (
    <Tooltip
      className={createClasses({
        ...(className ? { [className]: true } : {}),
        ...(props.clearDefaultStyles ? {} : { [styles['tooltip']]: true })
      })}
      {...props}
    >
      { heading && <h1 className={styles['tooltip__heading']}>{heading}</h1> }
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
                (dotsToLeft >= 2 && dotIndex === 0) ||
                (dotsToRight >= 2 && dotIndex === 4)
  
              return (
                <li 
                  key={adjustedIndex}
                  aria-label={`Step ${adjustedIndex + 1}`}
                  aria-current={isSelected ? 'step' : undefined}
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
          <span className={styles['tour-location__number']}>{n + 1}/{tourLength}</span>
        </div>
        <div className={styles['buttons']}>
          {!hideNextButton && n !== tourLength - 1 && (
            <button
              className={createClasses({
                [styles['button--primary']]: !clearButtonStyles,
                ...(nextButtonClassName ? { [nextButtonClassName]: true } : {})
              })}
              onClick={() => onNextClicked && onNextClicked()}>
              {nextText ?? 'Next'}
            </button>
          )}
          {!hideFinishButton && n === tourLength - 1 && (
            <button
              className={createClasses({
                [styles['button--primary']]: !clearButtonStyles,
                ...(finishButtonClassName ? { [finishButtonClassName]: true } : {})
              })}
              onClick={() => onFinishClicked && onFinishClicked()}>
              {finishText ?? 'Finish'}
            </button>
          )}
          <button
            className={createClasses({
              [styles['button--secondary']]: !clearButtonStyles,
              ...(skipButtonClassName ? { [skipButtonClassName]: true } : {})
            })}
            onClick={() => onSkipClicked && onSkipClicked()}>
            {skipText ?? 'Skip tour'}
          </button>
        </div>
      </div>
    </Tooltip>
  )
}
