import { afterEach, describe, expect, it, vi } from 'vitest'
import {
	calculateBoundedTooltipPosition,
	calculateTooltipPosition,
	createPositionOrder,
	TooltipPosition,
	tooltipPositions
} from '../../lib/utils/tooltip'

describe('createPositionOrder', () => {
	it('starts with the position passed in', () => {
		tooltipPositions.forEach((pos) => {
			expect(createPositionOrder(pos)[0]).toBe(pos)
		})
	})

	it('has the correct order', () => {
		const expected = {
			'top-left': [
				'top-left',
				'top-center',
				'top-right',
				'bottom-left',
				'bottom-center',
				'bottom-right',
				'left-top',
				'left-center',
				'left-bottom',
				'right-top',
				'right-center',
				'right-bottom'
			],
			'right-center': [
				'right-center',
				'right-top',
				'right-bottom',
				'left-center',
				'left-top',
				'left-bottom',
				'top-right',
				'top-center',
				'top-left',
				'bottom-right',
				'bottom-center',
				'bottom-left'
			],
			'bottom-right': [
				'bottom-right',
				'bottom-center',
				'bottom-left',
				'top-right',
				'top-center',
				'top-left',
				'right-bottom',
				'right-center',
				'right-top',
				'left-bottom',
				'left-center',
				'left-top'
			],
			'left-top': [
				'left-top',
				'left-center',
				'left-bottom',
				'right-top',
				'right-center',
				'right-bottom',
				'bottom-left',
				'bottom-center',
				'bottom-right',
				'top-left',
				'top-center',
				'top-right'
			]
		}

		Object.keys(expected).forEach((pos) => {
			expect(createPositionOrder(pos as TooltipPosition)).toStrictEqual(expected[pos])
		})
	})
})

describe('calculateTooltipPosition', () => {
	const tooltip = document.createElement('div')
	const on = document.createElement('div')

	const tooltipSize = { width: 100, height: 50 }
	const onSize = { width: 80, height: 40 }

	const extras = {
		x: 0,
		y: 0,
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		toJSON: () => {}
	}

	tooltip.getBoundingClientRect = vi.fn(() => ({
		...tooltipSize,
		...extras
	}))

	on.getBoundingClientRect = vi.fn(() => ({
		...onSize,
		...extras
	}))

	function isOrientedAbove({ y = 0 }) {
		return y <= -1 * tooltipSize.height
	}

	function isOrientedBelow({ y = 0 }) {
		return y >= onSize.height
	}

	function isOrientedLeft({ x = 0 }) {
		return x <= -1 * tooltipSize.width
	}

	function isOrientedRight({ x = 0 }) {
		return x >= onSize.width
	}

	function isAlignedTop({ y = 0 }) {
		return y + tooltipSize.height > 0 && y + tooltipSize.height < onSize.height
	}

	function isAlignedBottom({ y = 0 }) {
		return y > 0 && y < onSize.height
	}

	function isAlignedLeft({ x = 0 }) {
		return x + tooltipSize.width > 0 && x + tooltipSize.width < onSize.width
	}

	function isAlignedRight({ x = 0 }) {
		return x > 0 && x < onSize.width
	}

	it('positions to top-left correctly', () => {
		const pos = calculateTooltipPosition(tooltip, on, 'top-left')
		expect(isOrientedAbove(pos)).toBeTruthy()
		expect(isAlignedLeft(pos)).toBeTruthy()
	})

	it('positions to top-center correctly', () => {
		const pos = calculateTooltipPosition(tooltip, on, 'top-center')
		expect(isOrientedAbove(pos)).toBeTruthy()
		expect(isAlignedLeft(pos)).toBeFalsy()
		expect(isAlignedRight(pos)).toBeFalsy()
	})

	it('positions to top-right correctly', () => {
		const pos = calculateTooltipPosition(tooltip, on, 'top-right')
		expect(isOrientedAbove(pos)).toBeTruthy()
		expect(isAlignedRight(pos)).toBeTruthy()
	})

	it('positions to right-top correctly', () => {
		const pos = calculateTooltipPosition(tooltip, on, 'right-top')
		expect(isOrientedRight(pos)).toBeTruthy()
		expect(isAlignedTop(pos)).toBeTruthy()
	})

	it('positions to right-center correctly', () => {
		const pos = calculateTooltipPosition(tooltip, on, 'right-center')
		expect(isOrientedRight(pos)).toBeTruthy()
		expect(isAlignedTop(pos)).toBeFalsy()
		expect(isAlignedBottom(pos)).toBeFalsy()
	})

	it('positions to right-bottom correctly', () => {
		const pos = calculateTooltipPosition(tooltip, on, 'right-bottom')
		expect(isOrientedRight(pos)).toBeTruthy()
		expect(isAlignedBottom(pos)).toBeTruthy()
	})

	it('positions to bottom-left correctly', () => {
		const pos = calculateTooltipPosition(tooltip, on, 'bottom-left')
		expect(isOrientedBelow(pos)).toBeTruthy()
		expect(isAlignedLeft(pos)).toBeTruthy()
	})

	it('positions to bottom-center correctly', () => {
		const pos = calculateTooltipPosition(tooltip, on, 'bottom-center')
		expect(isOrientedBelow(pos)).toBeTruthy()
		expect(isAlignedLeft(pos)).toBeFalsy()
		expect(isAlignedRight(pos)).toBeFalsy()
	})

	it('positions to bottom-right correctly', () => {
		const pos = calculateTooltipPosition(tooltip, on, 'bottom-right')
		expect(isOrientedBelow(pos)).toBeTruthy()
		expect(isAlignedRight(pos)).toBeTruthy()
	})

	it('positions to left-top correctly', () => {
		const pos = calculateTooltipPosition(tooltip, on, 'left-top')
		expect(isOrientedLeft(pos)).toBeTruthy()
		expect(isAlignedTop(pos)).toBeTruthy()
	})

	it('positions to left-center correctly', () => {
		const pos = calculateTooltipPosition(tooltip, on, 'left-center')
		expect(isOrientedLeft(pos)).toBeTruthy()
		expect(isAlignedTop(pos)).toBeFalsy()
		expect(isAlignedBottom(pos)).toBeFalsy()
	})

	it('positions to left-bottom correctly', () => {
		const pos = calculateTooltipPosition(tooltip, on, 'left-bottom')
		expect(isOrientedLeft(pos)).toBeTruthy()
		expect(isAlignedBottom(pos)).toBeTruthy()
	})
})

describe('calculateBoundedTooltipPosition', () => {
	const tooltip = document.createElement('div')
	const on = document.createElement('div')

	const tooltipSize = { width: 100, height: 50 }
	const onSize = { width: 80, height: 40 }

	const extras = {
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		toJSON: () => {}
	}

	tooltip.getBoundingClientRect = vi.fn(() => ({
		x: 0,
		y: 0,
		...tooltipSize,
		...extras
	}))

	function isWithinScreen({ x = 0, y = 0 }) {
		return (
			x > 0 &&
			y > 0 &&
			x + tooltipSize.width < window.innerWidth &&
			y + tooltipSize.height < window.innerHeight
		)
	}

	function testAllPositions() {
		tooltipPositions.forEach((pos) => {
			const res = calculateBoundedTooltipPosition(tooltip, on, pos)
			expect(isWithinScreen(res)).toBeTruthy()
		})
	}

	afterEach(() => {
		// Reset getBoundingClientRect
		on.getBoundingClientRect = () => ({
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			...extras
		})
	})

	it('keeps the tooltip within the window when the element it is on is in the top left corner', () => {
		on.getBoundingClientRect = vi.fn(() => ({
			x: 0,
			y: 0,
			...onSize,
			...extras
		}))

		testAllPositions()
	})

	it('keeps the tooltip within the window when the element it is on is in the top right corner', () => {
		on.getBoundingClientRect = vi.fn(() => ({
			x: window.innerWidth - onSize.width,
			y: 0,
			...onSize,
			...extras
		}))

		testAllPositions()
	})

	it('keeps the tooltip within the window when the element it is on is in the bottom right corner', () => {
		on.getBoundingClientRect = vi.fn(() => ({
			x: window.innerWidth - onSize.width,
			y: window.innerHeight - onSize.height,
			...onSize,
			...extras
		}))

		testAllPositions()
	})

	it('keeps the tooltip within the window when the element it is on is in the bottom left corner', () => {
		on.getBoundingClientRect = vi.fn(() => ({
			x: 0,
			y: window.innerHeight - onSize.height,
			...onSize,
			...extras
		}))

		testAllPositions()
	})
})
