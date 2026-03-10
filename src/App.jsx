
import {useState,useEffect} from 'react';

import "./index.css"
import DarkModeToggler from './components/darktoggler';
import Basic from './components/basic';
import { FlipButton } from './components/buttonreverser';
const showContext=["Full-stack Developer with a passion for crafting seamless user experiences and robust backend solutions. Skilled in JavaScript, React.js, Node.js, Python, C++, and Express.js. Dedicated to delivering high-quality code and innovative solutions."]
const textSpeller=showContext[0];
;function App(){
  const [show, setShow] = useState(false);
  useEffect(() => {
    let i=0;
    const interval=setInterval(()=>{
      setShow(showContext.slice(0,i+1))
      i++;
      if (i>=showContext.length) clearInterval(interval);
    },40);
    return () => clearInterval(interval),[]});
    
  
  return (
    <div className="background-1">
      <div className="background"></div>
      <div className="headcontainer">
        <div className='heading'>
          <h1>DINESH</h1>
           
          <h1>A</h1>
        </div>
        
        <div className="content">
          <p>{}</p>
        </div>
      </div>
      
      <DarkModeToggler />
      <div className="container">
        
        
        
      </div>
    </div>
      
    
    
    
  )
}

export default App;