
function Known({ skills = [] }){
  return (
    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-200">
      {skills.map((skill, idx) => (
        <li key={skill ?? idx} className="">{skill}</li>
      ))}
    </ul>
  )
}

const Card = ({ name, role, skillset = [], onClose }) => {
  return (
    <>
      <div className="bg-white/5 p-6 rounded-lg w-[400px] text-white">
        <button onClick={onClose} className="mb-4 px-3 py-1 bg-gray-800 text-white rounded">Back</button>
        <h1 className="text-2xl font-bold mb-2">{name}</h1>
        <p className="text-sm text-gray-300 mb-4">{role}</p>
        <Known skills={skillset} />
      </div>
    </>
  )
}

export default Card
