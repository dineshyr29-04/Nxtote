
import {useState,useEffect} from 'react';

import "./index.css"
import DarkModeToggler from './components/darktoggler';
import Basic from './components/basic';
import { FlipButton } from './components/buttonreverser';
function App(){
  
    
  
  return (
    <div className="background-1">
      <div className='heading'>
        <h1>DINESH</h1>
        <br/> 
        <h1>A</h1>
        <div>

        </div>
      </div>
      
      <DarkModeToggler />
      <div className="container">
        
        {/*<div className='pagechanger'>
            <FlipButton  text1="Go back to next section" text2="Change to Next section"/>
        </div>*/}
        
      </div>
    </div>
      
    
    
    
  )
}

export default App;