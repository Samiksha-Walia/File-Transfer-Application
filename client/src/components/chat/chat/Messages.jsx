import { useContext , useEffect, useState,useRef} from 'react';
import {Box, styled, Typography} from '@mui/material';
import Background from '../../../assets/Background.png';
import { formatDateSeparator } from '../../../utils/common-utils';

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
        const isEnterKey = e.keyCode === 13 || e.which === 13;
        const isClick = e.type === 'click';

        if (!isEnterKey && !isClick) return;
        
        
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
                };
            }

            socket.current.emit('sendMessage', message);

            await newMessage(message);

            setValue('');
            setFile('');
            setImage('');
            setNewMessageFlag(prev=> !prev)
        

    };

    const DateSeparator = ({ label }) => (
        <Box sx={{ textAlign: 'center', my: 2 }}>
            <Typography
            sx={{
                fontSize: 12,
                color: '#666',
                backgroundColor: '#e0e0e0',
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 12,
                fontWeight: 500
            }}
            >
            {label}
            </Typography>
        </Box>
        );



    return(
        <Wrapper>
            <Component>
                {messages &&
                    messages.reduce((acc, message, index) => {
                    const messageDate = new Date(message.createdAt);
                    const prevDate = index > 0 ? new Date(messages[index - 1].createdAt) : null;

                    const isNewDate =
                        !prevDate || messageDate.toDateString() !== prevDate.toDateString();

                    if (isNewDate) {
                        acc.push(
                        <DateSeparator
                            key={`date-${message._id}`}
                            label={formatDateSeparator(message.createdAt)}
                        />
                        );
                    }

                    acc.push(
                        <Container key={message._id} ref={scrollRef}>
                        <Message message={message} />
                        </Container>
                    );

                    return acc;
                    }, [])
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