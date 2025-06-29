import { Dialog, Box, Button, Typography, styled } from "@mui/material";
import {useContext} from 'react';
import UserContext from "../../context/UserContext";

import Menu from "./menu/Menu";
import EmptyChat from "./chat/EmptyChat";
import ChatBox from "./chat/ChatBox";

const StyledDialog = styled(Box)`
    display: flex;
    height:'100%';
`;
const LeftComponent = styled(Box)`
    min-width: 450px;`;

const RightComponent = styled(Box)`
    width: 75%;
    min-width: 300px;
    height:100%;
    border-left: 1px solid rgba(0,0,0,0.14);`

const dialogStyle = {
    height: '95%',
    width: '100%',
    margin: '20px',
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: 0,
    boxShadow: 'none',
    overflow: 'hidden',
    
};


const ChatDialog = ({ onLogout }) => {

  const { account, setAccount, person, setPerson, socket } = useContext(UserContext);

  return (
    <Dialog
      open={true}
      PaperProps={{ sx: dialogStyle }}
      hideBackdrop="true"
      
    >
      <StyledDialog>
      <LeftComponent >
        <Menu onLogout={onLogout}/>
      </LeftComponent>

      <RightComponent >
        
        {Object.keys(person).length?<ChatBox/>:<EmptyChat/>}
      </RightComponent>
      </StyledDialog>
    </Dialog>
  );
};

export default ChatDialog;
