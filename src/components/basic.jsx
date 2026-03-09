
const details = [
  {
    name: "Dinesh A",
    role: "Full-Stack Developer",
    Skills: ["Javascript", "React.js", "Node.js", "Python", "C++", "Express.js"],
  },
];

function Basic() {
  return (
    
      
    <div className="outerbox">
      <ul className="members-list">
        {details.map((detail, idx) => (
          <li key={idx} className="member">
            <div className="meta">
              <div className="title">{detail.name}</div>
              <div className="role">{detail.role}</div>
            </div>
            <ul className="skills-list">
              {detail.Skills.map((s, i) => (
                <li key={i} className="skill">{s}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
   
  );
}

export default Basic;
