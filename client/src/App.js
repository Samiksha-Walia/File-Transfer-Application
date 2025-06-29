import React, { useState ,useContext, useEffect} from 'react';
import { UserProvider } from './context/UserContext';

import Messenger from './components/Messanger';

function App() {
  const [person, setPerson] = useState({});
  const [account, setAccount] = useState({});
  return (
    <UserProvider>
    <div >
      <Messenger /> 
    </div>
    </UserProvider>
  );
}

export default App;
