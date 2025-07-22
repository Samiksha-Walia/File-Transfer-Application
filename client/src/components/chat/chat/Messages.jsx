import { useContext, useEffect, useState, useRef } from 'react';
import { useTheme } from '@mui/material/styles';

import { useSelector } from 'react-redux';
import { format } from 'timeago.js';
import {CircularProgress, Box, styled, Typography} from '@mui/material';
import Background from '../../../assets/Background.png';
import { formatDateSeparator } from '../../../utils/common-utils';

import { UserProvider }from '../../../context/UserContext';
import UserContext from '../../../context/UserContext';

import { getMessages, newMessage } from '../../../service/api';

import UploadMessageBubble from './UploadMessageBubble';
import { v4 as uuidv4 } from 'uuid';


import Footer from "./Footer";
import Message from './Message';

const Wrapper = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
}));

const Component = styled(Box)(({ theme }) => ({
    height: '80vh',
    overflowY: 'scroll',
}));

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

    const [uploadingFiles, setUploadingFiles] = useState([]);

    const scrollRef = useRef();

    const handleFileUpload = (file) => {
    const id = uuidv4();
    setUploadingFiles(prev => [...prev, { id, file }]);
    };

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

    useEffect(() => {
        const timeout = setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'auto' });
        }, 100);
        return () => clearTimeout(timeout);
    }, [messages, uploadingFiles]);
    
    useEffect(() => {
    if (messages.length > 0) {
        scrollRef.current?.scrollIntoView({ behavior: 'auto' }); // not smooth here
    }
    }, [messages]);


    useEffect(()=>{
        scrollRef.current?.scrollIntoView({ behavior:'smooth'})
    },[messages,uploadingFiles])

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

    const DateSeparator = ({ label }) => {
        const theme = useTheme();
        const isDark = theme.palette.mode === 'dark';

        return (
            <Box sx={{ textAlign: 'center', my: 2 }}>
                <Typography
                    sx={{
                        fontSize: 12,
                        color: isDark ? '#ccc' : '#666',
                        backgroundColor: isDark ? '#444' : '#e0e0e0',
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontWeight: 500,
                    }}
                >
                    {label}
                </Typography>
            </Box>
        );
    };


    return(
         <>
        <Wrapper>
            <Component>
                {messages && messages.map((message, index) => {
                    const currentDate = formatDateSeparator(message.createdAt);
                    const prevDate = index > 0 ? formatDateSeparator(messages[index - 1].createdAt) : null;

                    const showDateSeparator = index === 0 || currentDate !== prevDate;

                    return (
                        <Container key={index}>
                            {showDateSeparator && <DateSeparator label={currentDate} />}
                            <Message message={message} />
                        </Container>
                    );
                })}


                    {uploadingFiles.map(({ id, file }) => (
                    <Container key={id}>
                        <UploadMessageBubble
                        file={file}
                        onSuccess={async (res) => {
                            const message = {
                                senderId: account._id,
                                receiverId: person._id,
                                conversationId: conversation._id,
                                type: 'file',
                                text: res.fileUrl // change based on your upload response
                            };
                            socket.current.emit('sendMessage', message);
                            await newMessage(message);
                            newMessage(message);
                            setNewMessageFlag(prev => !prev);
                            setUploadingFiles(prev => prev.filter(f => f.id !== id));
                        }}
                        onCancel={() => {
                            setUploadingFiles(prev => prev.filter(f => f.id !== id));
                        }}
                        />
                        <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                    <CircularProgress size={20} thickness={5} />
                    <Typography ml={1} variant="caption" color="text.secondary">Uploading…</Typography>
                    </Box>
                    </Container>
                    ))}
                 <div ref={scrollRef} />
            </Component>
           
            </Wrapper>
            <Footer 
                sendText={sendText}
                setValue={setValue}
                value={value}
                file={file}
                setFile={setFile}
                setImage={setImage}
                style={{marginBottom:0}}
                onFileSelect={handleFileUpload}
            />
         </>
    )
}

export default Messages;