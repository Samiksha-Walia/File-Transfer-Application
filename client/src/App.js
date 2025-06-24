import React, { useState } from 'react';
import UserContext from './context/UserContext';
import Messenger from './components/Messanger';

function App() {
  const [person, setPerson] = useState({});
  return (
    <UserContext.Provider value={{ person, setPerson }}>
    <div >
      <Messenger /> 
    </div>
    </UserContext.Provider>
  );
}

export default App;
