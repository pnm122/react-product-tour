import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Tooltip, { TooltipProps } from '../lib/components/Tooltip/Tooltip'
import React from 'react'

const tooltip = () => document.querySelector<HTMLElement>('[popover=manual]')!

function createTooltip(props?: Partial<TooltipProps>) {
	const { active, position } = props ?? {}
	return (
		<>
			<button id="button"></button>
			<Tooltip
				on="#button"
				active={active ?? true}
				position={position ?? 'bottom-center'}
				{...props}
			/>
		</>
	)
}

function renderTooltip(props?: Partial<TooltipProps>) {
	return render(createTooltip(props))
}

function hasDefaultStyles() {
	return Array.from(tooltip().classList.values()).find((c) => c.includes('tooltip--default-styles'))
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

	it('includes class name passed as a parameter', () => {
		renderTooltip({ className: 'test' })
		expect(tooltip().classList.contains('test')).toBeTruthy()
	})

	it('includes inline styling passed as a parameter', () => {
		renderTooltip({ style: { background: 'red' } })
		expect(tooltip().style.background).toEqual('red')
	})

	it('has default styling by default', () => {
		renderTooltip({ clearDefaultStyles: false })
		expect(hasDefaultStyles()).toBeTruthy()
	})

	it('clears default styling when set', () => {
		renderTooltip({ clearDefaultStyles: true })
		expect(hasDefaultStyles()).toBeFalsy()
	})

	it('includes an aria label', () => {
		renderTooltip({ ariaLabel: 'label' })
		expect(tooltip().getAttribute('aria-label')).toBe('label')
	})

	it('includes a role', () => {
		renderTooltip({ role: 'alert' })
		expect(tooltip().getAttribute('role')).toBe('alert')
	})
})
