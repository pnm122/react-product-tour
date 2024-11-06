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
        position="bottom-right"
      >
        Hello
      </Tooltip>
      <button id="button" onClick={() => setActive(!active)}>Button</button>
    </>
  )
}

export default App
