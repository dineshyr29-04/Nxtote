
import {useState,useEffect} from 'react';

import "./index.css"
import DarkModeToggler from './components/darktoggler';
import Basic from './components/basic';
import { FlipButton } from './components/buttonreverser';
function App(){
  
    
  
  return (
    <div className="background">
      <h1 class="heading">About</h1>
      <DarkModeToggler />
      <div>
        <Basic />
        <div className='pagechanger'>
            <FlipButton  text1="I'm in Dinesh A" text2="Change to Next section"/>
        </div>
        
      </div>
    </div>
      
    
    
    
  )
}

export default App;