
function Known(props){
    return(
        <ul>
            {props.skills.map(skill=>{
                return <li key="skill">{skill}</li>
            })}
        </ul>
    )

}

const Card = () =>{
    const skills=["JavaScript", "React", "Node.js"]
    return(
        <>
        <div>
            <h1>Dinesh A</h1>
            <p>Software Developer</p>
            <Known skills={skills} />
        </div>
        </>
    )
}
export default Card