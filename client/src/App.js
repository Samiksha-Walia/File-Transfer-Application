import React, { useState ,useContext, useEffect} from 'react';
import UserContext from './context/UserContext';
import Messenger from './components/Messanger';

function App() {
  const [person, setPerson] = useState({});
  const [account, setAccount] = useState({});
  return (
    <UserContext.Provider value={{ person, setPerson, account, setAccount  }}>
    <div >
      <Messenger /> 
    </div>
    </UserContext.Provider>
  );
}

export default App;
