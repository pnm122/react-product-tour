import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Tooltip, { TooltipProps } from '../lib/components/Tooltip/Tooltip'
import React from 'react'

// const tooltip = () => document.querySelector<HTMLElement>('[popover=manual]')!

function createTooltip(props?: Partial<TooltipProps>) {
	const { active, position } = props ?? {}
	return (
		<>
			<button id="button"></button>
			<Tooltip on="#button" active={active ?? true} position={position ?? 'bottom-center'} />
		</>
	)
}

function renderTooltip(props?: Partial<TooltipProps>) {
	return render(createTooltip(props))
}

describe('Tooltip', () => {
	it('renders', () => {
		renderTooltip()
		expect(true).toBe(true)
	})

	it('shows the popover when active', async () => {
		const spy = vi.spyOn(HTMLElement.prototype, 'showPopover')
		const { rerender } = renderTooltip({ active: true })
		expect(spy).toHaveBeenCalledOnce()

		spy.mockClear()
		rerender(createTooltip({ active: false }))
		rerender(createTooltip({ active: true }))
		expect(spy).toHaveBeenCalledOnce()
	})

	it('hides the popover when not active', async () => {
		const spy = vi.spyOn(HTMLElement.prototype, 'hidePopover')
		const { rerender } = renderTooltip({ active: false })
		expect(spy).toHaveBeenCalledOnce()

		spy.mockClear()
		rerender(createTooltip({ active: true }))
		rerender(createTooltip({ active: false }))
		expect(spy).toHaveBeenCalledOnce()
	})
})
