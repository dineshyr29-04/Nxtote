
import {useState,useEffect} from 'react';

import "./index.css"
import DarkModeToggler from './components/darktoggler';
import Basic from './components/basic';
function App(){
  
    
  
  return (
    <div className="background">
      <header className="background-1">
        <h1 className='h1'>Dinesh A</h1>
      <DarkModeToggler />
      </header>
      <div>
        <Basic />
      </div>
      

    </div>
      
    
    
    
  )
}

export default App;