import { Dialog, Box, Button, Typography, styled } from "@mui/material";
import {useContext} from 'react';
import UserContext from "../../context/UserContext";

import Menu from "./menu/Menu";
import EmptyChat from "./chat/EmptyChat";
import ChatBox from "./chat/ChatBox";

const StyledDialog = styled(Box)`
    display: flex;
    flex: 1;
    height: 100vh;
    width: 100%;
    overflow: hidden;
`;
const LeftComponent = styled(Box)`
    min-width: 350px;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const RightComponent = styled(Box)`
    flex: 1;
    height: 100%;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    border-left: 1px solid rgba(0,0,0,0.14);
`;

const dialogStyle = {
    height: '95%',
    width: '100%',
    margin: '20px',
    maxWidth: '100%',
    maxHeight: '100%',
    boxShadow: 'none',
    overflow: 'hidden',
    display: 'flex',
    
};


const ChatDialog = ({ onLogout, currentTheme, toggleTheme }) => {

  const { account, setAccount, person, setPerson, socket } = useContext(UserContext);

  return (
    <Dialog
      open={true}
      PaperProps={{ sx: dialogStyle }}
      hideBackdrop="true"
      
    >
      <StyledDialog>
      <LeftComponent >
        <Menu onLogout={onLogout} 
          currentTheme={currentTheme}
          toggleTheme={toggleTheme}/>
      </LeftComponent>

      <RightComponent >
        
        {Object.keys(person).length?<ChatBox/>:<EmptyChat/>}
      </RightComponent>
      </StyledDialog>
    </Dialog>
  );
};

export default ChatDialog;
