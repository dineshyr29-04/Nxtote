
import { useState } from 'react'
import './App.css'
import Card from './card.jsx'

function List({ founders, className, onItemClick }){
  return (
    <ul className={className}>
      {founders.map((founder, idx) => (
        <li
          key={founder.name}
          className="p-2 cursor-pointer transition-transform duration-200 hover:bg-yellow-100 hover:scale-105 hover:border-r-4 hover:border-pink-300"
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
        <div className="border border-black w-[400px] p-5 rounded-lg relative text-[#4b3a4b] overflow-hidden bg-white/5">
          <div className="scan"></div>
          <h1 className="text-3xl font-bold mb-4 text-white tw-debug">Founders</h1>
          <List
            founders={founders}
            className="list-none p-5 m-5 rounded-xl bg-gray-200 text-black"
            onItemClick={cardMember}
          />
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
