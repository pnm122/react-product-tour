import { useState } from 'react'
import './App.css'
import ProductTour, { ProductTourProps } from '../lib/components/ProductTour/ProductTour'

function App() {
  const [activeStep, setActiveStep] = useState(0)

  const steps: ProductTourProps['steps'] = [{
    tooltipOn: 'a',
    heading: 'Step 1',
    body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    position: 'top-center'
  }, {
    tooltipOn: 'b',
    heading: 'Step 2',
    body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    position: 'top-center'
  }, {
    tooltipOn: 'c',
    heading: 'Step 3',
    body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    position: 'top-center'
  }, {
    tooltipOn: 'd',
    heading: 'Step 4',
    body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    position: 'top-center'
  }]

  return (
    <>
      <ProductTour
        steps={steps}
        name='Product tour'
        activeStep={activeStep}
        onNextClicked={() => setActiveStep(activeStep + 1)}
        onFinishClicked={() => setActiveStep(-1)}
        onSkipClicked={() => setActiveStep(-1)}
      />
      {/* <ProductTourTooltip
        on="button"
        active={active}
        n={n}
        tourLength={9}
        clearButtonStyles
        name="Product tour"
        onNextClicked={() => setN(n + 1)}
        onFinishClicked={() => setActive(false)}
        onSkipClicked={() => setActive(false)}
        position="left-center"
        heading="Hello world"
        body="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      >
      </ProductTourTooltip> */}
      <button id="a">Button</button>
      <button id="b">Button</button>
      <button id="c">Button</button>
      <button id="d">Button</button>
    </>
  )
}

export default App
