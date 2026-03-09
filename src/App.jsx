
import {useState,useEffect} from 'react';

import "./index.css"
import DarkModeToggler from './components/darktoggler';
import Basic from './components/basic';
import { FlipButton } from './components/buttonreverser';
function App(){
  
    
  
  return (
    <div className="background">
      <header className="background-1">
        <h1 className='h1'>Dinesh A</h1>
      <DarkModeToggler />
      </header>
      <div>
        <Basic />
        <FlipButton  text1="I'm in Dinesh A" text2="Change to Next section"/>
      </div>
      

    </div>
      
    
    
    
  )
}

export default App;