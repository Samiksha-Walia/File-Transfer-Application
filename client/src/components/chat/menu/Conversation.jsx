import { Box, Typography, styled } from '@mui/material';
import Profile_icon from '../../../assets/Profile_icon.png';

import {useContext} from 'react'
import UserContext from '../../../context/UserContext';
import { AccountTree } from '@mui/icons-material';

import { setConversation } from '../../../service/api';

const Component = styled(Box)`
  display: flex;
  height: 45px;
  padding: 13px 0;
  cursor: pointer;
`;

const Image = styled('img')({
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  padding: '0 14px',
  marginRight: '20px',
  objectFit: 'cover',
});

const Conversation = ({ user }) => {

  const {setPerson , account}=useContext(UserContext);

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
      <Image src={user.profilePicture || Profile_icon} alt="Profile" />
      <Typography variant="body1">{user.username}</Typography>
    </Component>
  );
};

export default Conversation;
