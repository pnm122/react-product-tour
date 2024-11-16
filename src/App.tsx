import { useState } from 'react'
import './App.css'
import ProductTour, { ProductTourProps } from '../lib/components/ProductTour/ProductTour'

function App() {
	const [activeStep, setActiveStep] = useState(0)

	const steps: ProductTourProps['steps'] = [
		{
			on: '#a',
			heading: 'Step 1',
			body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
			position: 'bottom-center'
		},
		{
			on: '#b',
			heading: 'Step 2',
			body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
			position: 'bottom-center'
		},
		{
			on: '#c',
			heading: 'Step 3',
			body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
			position: 'bottom-center'
		},
		{
			on: '#d',
			heading: 'Step 4',
			body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
			position: 'bottom-center'
		}
	]

	return (
		<>
			<ProductTour
				steps={steps}
				name="Product tour"
				activeStep={activeStep}
				onNextClicked={() => setActiveStep(activeStep + 1)}
				onFinishClicked={() => setActiveStep(-1)}
				onSkipClicked={() => setActiveStep(-1)}
			/>
			<div className="header">
				<button id="a" className="test">
					Button
				</button>
				<div id="button-group">
					<button id="b">Button</button>
				</div>
				<button id="c">Button</button>
				<button id="d">Button</button>
			</div>
		</>
	)
}

export default App
