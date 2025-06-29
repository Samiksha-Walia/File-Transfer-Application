import {Box,Typography} from "@mui/material";

import { useContext,useEffect,useState } from "react";
import UserContext from "../../../context/UserContext";
import {getConversation} from '../../../service/api';

import ChatHeader from "./ChatHeder";
import Messages from "./Messages";


const ChatBox=()=> {

    const { account, setAccount, person, setPerson, socket } = useContext(UserContext);

    const [conversation, setConversation] = useState({});

    useEffect(()=>{
        const getConversationDetails = async ()=>{
            let data= await getConversation({senderId: account._id, receiverId: person._id});
            console.log(data);
            setConversation(data);
        }
        getConversationDetails();
    },[person._id]);

    return(
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        <ChatHeader person={person}/>
        <Messages person={person} conversation={conversation}/>
      
        </Box>
    )
}

export default ChatBox;