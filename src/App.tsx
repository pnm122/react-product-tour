import { useState } from 'react'
import { Tooltip } from '../lib/main'
import './App.css'

function App() {
  const [active, setActive] = useState(true)

  return (
    <>
      <Tooltip
        on="button"
        active={active}
        position="top-center"
      >
        Hello world :)
      </Tooltip>
      <button id="button" style={{ margin: '64px' }} onClick={() => setActive(!active)}>Button</button>
    </>
  )
}

export default App
