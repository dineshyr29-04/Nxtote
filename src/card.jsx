
function Known({ skills = [] }){
  return (
    <ul className="list-disc pl-5 space-y-1 text-md text-gray-200">
      {skills.map((skill, idx) => (
        <li key={skill ?? idx} className="border border-gray-400 p-2 mb-2 transition:transform duration-300 rounded-md bg-gray-700 cursor-pointer hover:bg-gray-500 hover:scale-105">{skill}</li>
      ))}
    </ul>
  )
}

const Card = ({ name, role, skillset = [], onClose }) => {
  return (
    <>
      <div className="outerbox flex flex-col justify-center bg-white/5 p-6 rounded-lg w-[400px] text-white">
        
        <h1 className="text-2xl font-bold mb-2">{name}</h1>
        <p className="text-xl text-gray-300 mb-4">{role}</p>
        <Known skills={skillset} />
        <div className="flex justify-end align-bottom">
            <button onClick={onClose} className="mb-4 px-3 py-1 bg-gray-800 text-white rounded text-left">Back</button>
        </div>
        
      </div>
    </>
  )
}

export default Card
