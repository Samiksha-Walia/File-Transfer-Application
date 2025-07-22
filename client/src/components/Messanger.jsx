
import {AppBar,Toolbar, styled,Box} from "@mui/material";
import {useContext, useState, useEffect} from 'react';

import LoginDialog from "./account/LoginDialog";
import AuthDialog from "./account/AuthDialog";
import ChatDialog from "./chat/ChatDialog";
import UserContext from "../context/UserContext";
import Settings from './chat/menu/settings';
import Header from './chat/menu/Header';


import axios from 'axios';


const Component = styled(Box)`
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #DCDCDC;
  display: flex;
  flex-direction: column;
`;


const StyledAppBar = styled(AppBar)`
    background-color:#000000;
    height: 220px;
    box-shadow:none;`

const Messenger = ({ currentTheme, toggleTheme }) => {
  const [openSettingsDrawer, setOpenSettingsDrawer] = useState(false);

  const { account, setAccount, person, setPerson, socket } = useContext(UserContext);
  const isAuthenticated = !!account._id;
  
   // ✅ Check if token exists on page load (auto-login)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUser = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/user', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log("🔑 Token valid, user fetched", res.data);
          setAccount(res.data);
        } catch (err) {
          console.error('❌ Token invalid or error fetching user:', err);
          localStorage.removeItem('token');
          setAccount({});
        }
      };
      fetchUser();
    }
  }, [setAccount]);

  const handleLoginSuccess = (userData) => {
    console.log("✅ Login successful, showing ChatDialog",userData);
    
    setAccount(userData);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    
    setAccount({});
  };
  return (
    <Component>
    <Header
      currentTheme={currentTheme}
      toggleTheme={toggleTheme}
    />
    <StyledAppBar>
      <Toolbar />
    </StyledAppBar>

    {isAuthenticated ? (
    <ChatDialog onLogout={handleLogout} currentTheme={currentTheme} toggleTheme={toggleTheme}/>
    ) : (
        <AuthDialog onLoginSuccess={handleLoginSuccess} />
      )}
    </Component>
  );
}


export default Messenger;