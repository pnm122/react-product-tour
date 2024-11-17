//    0 1 2
//  9       3
// 10       4
// 11       5
//    6 7 8
export const tooltipPositions = [
	'top-left',
	'top-center',
	'top-right',
	'right-top',
	'right-center',
	'right-bottom',
	'bottom-left',
	'bottom-center',
	'bottom-right',
	'left-top',
	'left-center',
	'left-bottom'
] as const

export type TooltipPosition = (typeof tooltipPositions)[number]

export const numberToPosition = Object.fromEntries(
	tooltipPositions.map((pos, index) => [index, pos])
)

// flip keys and values for efficient use in both directions
export const positionToNumber = Object.fromEntries(
	Object.entries(numberToPosition).map((e) => [e[1], parseInt(e[0])])
)

/** Create the order of positions to try based on a starting position.
 * Positions are in form [orientation]-[alignment].
 * Algorithm:
 * Try all alignments in the same orientation from closest to furthest from starting position.
 * Try all alignments on the opposite orientation in the same order.
 * Try all alignments counter-clockwise one rotation.
 * Try all alignments clockwise one rotation.
 */
export function createPositionOrder(position: TooltipPosition) {
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

		return alignment === 0
			? [start, start + 1, start + 2]
			: alignment === 1
				? [start, start - 1, start + 1]
				: [start, start - 1, start - 2]
	}

	function startOfOrientation(n: number) {
		return n - (n % 3)
	}

	function endOfOrientation(n: number) {
		return startOfOrientation(n) + 2
	}

	// Get the alignment of the same orientation as n closest to start
	function alignmentClosestToStart(n: number, start: number) {
		const startSide = startOfOrientation(start) / 3
		if ([0, 3].includes(startSide)) {
			// Lowest number of orientations adjacent to orientations 0 and 3 are closest
			return startOfOrientation(n)
		} else {
			// Highest number of orientations adjacent to orientations 1 and 2 are closest
			return endOfOrientation(n)
		}
	}

	return [
		...orderWithinOrientation(start),
		...orderWithinOrientation(add(start, 6)),
		...orderWithinOrientation(alignmentClosestToStart(add(start, 9), start)),
		...orderWithinOrientation(alignmentClosestToStart(add(start, 3), start))
	].map((n) => numberToPosition[n as 0]) as TooltipPosition[]
}

/**
 * Calculate the x and y position of a tooltip on an element, given a certain position
 * @param tooltip Tooltip element
 * @param elem Element to attach tooltip to
 * @param pos Position of the tooltip
 * @returns x and y positions of the tooltip
 */
export function calculateTooltipPosition(
	tooltip: HTMLElement,
	elem: HTMLElement,
	pos: TooltipPosition
) {
	// Must be kept aligned with CSS variables
	const arrowHalfWidth = 8
	const arrowLength = 8
	const arrowSideOffset = 4
	// ---------------------------------------
	const gapToElement = 2

	let x = 0
	let y = 0

	const onRect = elem.getBoundingClientRect()
	const tooltipRect = tooltip.getBoundingClientRect()

	if (pos.startsWith('top')) {
		x = onRect.x + onRect.width / 2
		y = onRect.y - tooltipRect.height - arrowLength - gapToElement
	} else if (pos.startsWith('bottom')) {
		x = onRect.x + onRect.width / 2
		y = onRect.y + onRect.height + arrowLength + gapToElement
	} else if (pos.startsWith('right')) {
		x = onRect.x + onRect.width + arrowLength + gapToElement
		y = onRect.y + onRect.height / 2
	} else if (pos.startsWith('left')) {
		x = onRect.x - tooltipRect.width - arrowLength - gapToElement
		y = onRect.y + onRect.height / 2
	}

	if (['bottom-right', 'top-right'].includes(pos)) {
		x -= arrowSideOffset + arrowHalfWidth
	} else if (['bottom-center', 'top-center'].includes(pos)) {
		x -= tooltipRect.width / 2
	} else if (['bottom-left', 'top-left'].includes(pos)) {
		x -= tooltipRect.width - arrowSideOffset - arrowHalfWidth
	}

	if (['right-bottom', 'left-bottom'].includes(pos)) {
		y -= arrowSideOffset + arrowHalfWidth
	} else if (['right-center', 'left-center'].includes(pos)) {
		y -= tooltipRect.height / 2
	} else if (['right-top', 'left-top'].includes(pos)) {
		y -= tooltipRect.height - arrowSideOffset - arrowHalfWidth
	}

	return { x, y }
}

/**
 * Calculate the x and y position of a tooltip on an element, bounding it within the screen if possible
 * @param tooltip Tooltip element
 * @param elem Element to attach tooltip to
 * @param pos Preferred position of the tooltip
 * @returns x, y, and final position of the tooltip
 */
export function calculateBoundedTooltipPosition(
	tooltip: HTMLElement,
	elem: HTMLElement,
	pos: TooltipPosition
) {
	const order = createPositionOrder(pos)

	const tooltipRect = tooltip.getBoundingClientRect()

	const { foundWorkingPosition, ...res } = order.reduce<{
		foundWorkingPosition: boolean
		x: number
		y: number
		finalPosition: TooltipPosition
	}>(
		(acc, positionToTry) => {
			// Already found working position
			if (acc.foundWorkingPosition) return acc

			const { x, y } = calculateTooltipPosition(tooltip, elem, positionToTry)

			const withinScreenX = x >= 0 && x + tooltipRect.width < window.innerWidth
			const withinScreenY = y >= 0 && y + tooltipRect.height < window.innerHeight

			if (withinScreenX && withinScreenY) {
				return {
					foundWorkingPosition: true,
					x,
					y,
					finalPosition: positionToTry
				}
			} else {
				return acc
			}
		},
		{
			foundWorkingPosition: false,
			x: -1,
			y: -1,
			finalPosition: 'left-top'
		}
	)

	if (foundWorkingPosition) return res

	// If all positions aren't working, display the tooltip with the default position
	const { x, y } = calculateTooltipPosition(tooltip, elem, pos)
	return {
		x,
		y,
		finalPosition: pos
	}
}
