import { useContext , useEffect, useState,useRef} from 'react';
import {Box, styled} from '@mui/material';
import Background from '../../../assets/Background.png';

import { UserProvider }from '../../../context/UserContext';
import UserContext from '../../../context/UserContext';

import { getMessages, newMessage } from '../../../service/api';


import Footer from "./Footer";
import Message from './Message';

const Wrapper = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
`;

const Component = styled(Box)`
    height: 80vh;
    overflow-y: scroll;
`;

const Container = styled(Box)`
    padding:1px 80px;
`;

const Messages=({conversation})=>
{
    const { account, setAccount, person, setPerson, socket, newMessageFlag,setNewMessageFlag } = useContext(UserContext);
    const [value,setValue]=useState('');
    const [messages,setMessages] = useState([]);
    //const [newMessageFlag,setNewMessageFlag] = useState([]);
    const [file, setFile] = useState();
    const [image, setImage] = useState('');
    const [incomingMessage, setIncomingMessage] = useState(null);

    const scrollRef = useRef();

    useEffect(() => {
        socket.current.on('getMessage', data => {
            setIncomingMessage({
                ...data,
                createdAt: Date.now()
            })
        })
    }, []);

    useEffect(() => {
    const getMessageDetails = async () => {
        if(conversation?._id) {
            const data = await getMessages(conversation._id);
            setMessages(data);
        }
    };
    conversation._id && getMessageDetails();
}, [person._id, conversation._id,newMessageFlag]);

    useEffect(()=>{
        scrollRef.current?.scrollIntoView({ transition:'smooth'})
    },[messages])

    useEffect(() => {
        incomingMessage && conversation?.members?.includes(incomingMessage.senderId) && 
            setMessages((prev) => [...prev, incomingMessage]);
        
    }, [incomingMessage, conversation]);

    const sendText =async(e)=>{
        const code = e.keyCode || e.which;
        if(code===13){
            let message = {};
            if(!file){
                message = {
                    senderId: account._id,
                    receiverId: person._id,
                    conversationId:conversation._id,
                    type:'text',
                    text: value
                }
            } else{
                message = {
                    senderId: account._id,
                    receiverId: person._id,
                    conversationId:conversation._id,
                    type:'file',
                    text: image
                }
            }

            socket.current.emit('sendMessage', message);

            await newMessage(message);

            setValue('');
            setFile('');
            setImage('');
            setNewMessageFlag(prev=> !prev)
        }

    }

    return(
        <Wrapper>
            <Component>
                {
                    messages && messages.map(message=>(
                        <Container ref={scrollRef}>
                            <Message message={message}/>
                        </Container>
                        
                    ))
                }
            </Component>
            <Footer 
                sendText={sendText}
                setValue={setValue}
                value={value}
                file={file}
                setFile={setFile}
                setImage={setImage}
                style={{marginBottom:0}}
            />
        </Wrapper>
    )
}

export default Messages;