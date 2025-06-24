import {Box,Typography} from "@mui/material";

import { useContext } from "react";
import UserContext from "../../../context/UserContext";

import ChatHeader from "./ChatHeder";
import Messages from "./Messages";


const ChatBox=()=> {

    const {person} = useContext(UserContext);

    return(
        <Box style={{height:'75%'}}>
        <ChatHeader person={person}/>
        <Messages person={person}/>
      
        </Box>
    )
}

export default ChatBox;