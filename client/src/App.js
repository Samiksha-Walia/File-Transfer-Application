import React, { useState ,useContext, useEffect, useMemo} from 'react';
import { UserProvider } from './context/UserContext';

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Messenger from './components/Messanger';

function App() {
  const [mode, setMode] = useState(localStorage.getItem('theme') || 'light');
  const [person, setPerson] = useState({});
  const [account, setAccount] = useState({});

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newMode);
    setMode(newMode);
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      background: {
        default: mode === 'dark' ? '#121212' : '#f0f0f0',
      },
    },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <UserProvider>
        <div >
          <Messenger currentTheme={mode} toggleTheme={toggleTheme}/> 
        </div>
        </UserProvider>
    </ThemeProvider>
  );
}

export default App;
