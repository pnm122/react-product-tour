import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

let showPopover: () => void, hidePopover: () => void

beforeAll(() => {
	// ResizeObserver not supported
	vi.stubGlobal(
		'ResizeObserver',
		vi.fn(() => ({
			observe: vi.fn(),
			unobserve: vi.fn(),
			disconnect: vi.fn()
		}))
	)

	// Popover API not supported (currently)
	// Save implementation if it exists, then replace with mocked function
	showPopover = HTMLElement.prototype.showPopover
	hidePopover = HTMLElement.prototype.hidePopover

	HTMLElement.prototype.showPopover = vi.fn()
	HTMLElement.prototype.hidePopover = vi.fn()
})

afterEach(() => {
	cleanup()
})

afterAll(() => {
	// Reset changed globals
	HTMLElement.prototype.showPopover = showPopover
	HTMLElement.prototype.hidePopover = hidePopover
})
