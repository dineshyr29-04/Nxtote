// ...existing code...
import { useState } from 'react'
import './App.css'
import Card from './card.jsx'

function List({ founders, className, onItemClick }){
  return (
    <ul className={className}>
      {founders.map((founder, idx) => (
        <li
          key={founder.name}
          className="founder-item"
          onClick={() => onItemClick(founder, idx)}
        >
          {founder.role} - {founder.name}
        </li>
      ))}
    </ul>
  )
}

function App() {
  const [selectedFounder, setSelectedFounder] = useState(null)

  const skills = [
    {id: 1, skill:["Javascript","React","Node.js","Python","c++","Express.js","MongoDB"]},
    {id: 2, skill:["IoT","Raspberry Pi","Arduino","ESP32","Sensors","Actuators"]},
    {id: 3, skill:["Machine Learning","Data Analysis","Python","TensorFlow","Scikit-learn"]},
    {id: 4, skill:["Product Design","UI/UX Design","Figma","Adobe XD","Prototyping"]}
  ]

  function cardMember(founder, idx){
    const skillset = skills[idx]?.skill || []
    setSelectedFounder({ ...founder, skillset })
  }

  const founders = [
    {role: "Software Developer",name:"Dinesh A"},
    {role:"IoT Developer", name:"Anand M"},
    {role:"ML Engineer", name:"Dhanush Shenoy H"},
    {role:"Product Designer", name:"Vignesh A"}
  ]

  return (
    <>
      {selectedFounder === null ? (
        <div className="box">
          <div className="scan"></div>
          <h1>Founders</h1>
          <List founders={founders} className="founders" onItemClick={cardMember} />
        </div>
      ) : (
        <Card
          name={selectedFounder.name}
          role={selectedFounder.role}
          skillset={selectedFounder.skillset}
          onClose={() => setSelectedFounder(null)}
        />
      )}
    </>
  )
}

export default App
// ...existing code...