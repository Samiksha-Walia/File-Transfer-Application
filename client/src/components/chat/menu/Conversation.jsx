import { Box, Typography, styled } from '@mui/material';
import Profile_icon from '../../../assets/Profile_icon.png';

import {useContext, useEffect,useState} from 'react'
import UserContext from '../../../context/UserContext';
import { AccountTree } from '@mui/icons-material';

import { setConversation, getConversation} from '../../../service/api';
import { formatDate } from '../../../utils/common-utils';

const Component = styled(Box)`
  display: flex;
  height: 45px;
  padding: 13px 0;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: #f1f1f1;
    transform: scale(1.02);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
`;

const Image = styled('img')({
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  padding: '0 14px',
  marginRight: '20px',
  objectFit: 'cover',
  
});

const Container = styled(Box)`
    display: flex;
`;

const Timestamp = styled(Typography)`
    font-size: 12px;
    margin-left: auto;
    color: #00000099;
    margin-right: 20px;
`;


const Text = styled(Typography)`
    display: block;
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
`;

const HoverableUsername = styled(Typography)`
  display: inline-block;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    color: #333;
    transform: scale(1.05);
    text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
  }
`;



const Conversation = ({ user }) => {

  const { account, setAccount, person, setPerson, socket,newMessageFlag } = useContext(UserContext);
 

  const [message, setMessage] = useState({});


  useEffect(() => {
        const getConversationMessage = async() => {
            const data = await getConversation({ senderId: account._id, receiverId: user._id });
            setMessage({ text: data?.message, timestamp: data?.updatedAt });
        }
        getConversationMessage();
    }, [newMessageFlag]);


  const getUser = async () => {
  if (!account?._id || !user?._id) {
    console.error('Account or user ID missing:', { account, user });
    return;
  }

  setPerson(user);
  await setConversation({ senderId: account._id, receiverId: user._id });
};


  return (
    <Component onClick={ getUser}>
      <Box>
        <Image src={user.profilePicture || Profile_icon} alt="Profile" />
      </Box>
      <Box style={{ width:'100%'}}>
        <Container>
         <HoverableUsername >{user.username}</HoverableUsername>
         {
            message?.text && 
                <Timestamp>{formatDate(message?.timestamp)}</Timestamp>
         }
        </Container>
        <Box>
          <Text>{message?.text?.includes('localhost') ? 'media': message.text}</Text>
        </Box>
      </Box>
      
    </Component>
  );
};

export default Conversation;
