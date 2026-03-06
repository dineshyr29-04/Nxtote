
function Known({ skills = [] }){
  return (
    <ul>
      {skills.map((skill, idx) => (
        <li key={skill ?? idx}>{skill}</li>
      ))}
    </ul>
  )
}

const Card = ({ name, role, skillset = [], onClose }) => {
  return (
    <>
      <div className="card-view">
        <button onClick={onClose} className="back">Back</button>
        <h1 className="foudercard">{name}</h1>
        <p className="founder">{role}</p>
        <Known skills={skillset} />
      </div>
    </>
  )
}

export default Card
