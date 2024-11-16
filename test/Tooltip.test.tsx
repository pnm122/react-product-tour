import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Tooltip, { TooltipProps } from '../lib/components/Tooltip/Tooltip'
import React from 'react'

function renderTooltip(props?: Partial<TooltipProps>) {
	const { active, position } = props ?? {}
	render(
		<>
			<Tooltip on="#button" active={active ?? true} position={position ?? 'bottom-center'} />
			<button id="button"></button>
		</>
	)
}

describe('Tooltip', () => {
	it('renders', () => {
		renderTooltip()
		expect(true).toBe(true)
	})
})
