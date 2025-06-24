
import {AppBar,Toolbar, styled,Box} from "@mui/material";
import {useState, useEffect} from 'react';

import LoginDialog from "./account/LoginDialog";
import AuthDialog from "./account/AuthDialog";
import ChatDialog from "./chat/ChatDialog";

const Component=styled(Box)`
    height:100vh;
    background-color:#DCDCDC;`

const Header = styled(AppBar)`
    background-color:#000000;
    height: 220px;
    Box-shadow:None`

const Messenger = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 🟢 track login

   // ✅ Check if token exists on page load (auto-login)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    console.log("✅ Login successful, showing ChatDialog");
    setIsAuthenticated(true); // 🟢 Switch to chat
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };
  return (
    <Component>
    <Header >
        <Toolbar>
            
        </Toolbar>
    </Header>
    {isAuthenticated ? (
    <ChatDialog onLogout={handleLogout}/>
    ) : (
        <AuthDialog onLoginSuccess={handleLoginSuccess} />
      )}
    </Component>
  );
}


export default Messenger;