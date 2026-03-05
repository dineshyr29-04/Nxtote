import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function List({founders,className}){
  return <ul className={className}>{founders.map(founder=>{
    return  <li key={founder.name} className="founder-item">{founder.role} - {founder.name}</li>
  })}</ul>
}     

function App() {
  const [count, setCount] = useState(0)
  
  const founders= [
    {role: "Software Developer",name:"Dinesh A"},
    {role:"IoT Developer", name:"Anand M"},
    {role:"ML Engineer", name:"Dhanush Shenoy H"},
    {role:"Product Designer", name:"Vignesh A"}
  ]
  return (
    <>
      <div className="box">
        <div className="scan"></div>
        <h1>Founders</h1>
        <List founders={founders} className="founders"  />
      </div>
    </>
  )
}

export default App
