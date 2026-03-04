import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Intro} from './intro.jsx';


function App() {
  const [count, setCount] = useState(0)
  const founders=["Dinesh","Vicky","Anand","Dhanush Shenoy"]
  return (
    <>
      
      <div>
        <Intro />
        <h1 className="h">Founders of Cardio Nerve</h1>
        <ul>
          {founders.map(item =>{
             return <li className="founders">{item}</li>
          })}
        </ul>
      </div>
    </>
  )
}

export default App
