import { Box, Typography, styled, Badge } from '@mui/material';
import Profile_icon from '../../../assets/Profile_icon.png';

import {useContext, useEffect,useState} from 'react'
import UserContext from '../../../context/UserContext';
import { AccountTree } from '@mui/icons-material';

import { setConversation, getConversation} from '../../../service/api';
import { formatDate } from '../../../utils/common-utils';

const Component = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '70px',
  padding: '10px 0',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
  backgroundColor: theme.palette.background.paper,

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'scale(1.02)',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  },
}));

const Image = styled('img')({
  width: '80px',
  height: '53px',
  borderRadius: '50%',
  padding: '0 14px',
  marginRight: '15px',
  objectFit: 'cover',
  
});

const Container = styled(Box)`
    display: flex;
    align-items: center;
`;

const Timestamp = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  color: theme.palette.text.secondary,
}));


const Text = styled(Typography)(({ theme }) => ({
  display: 'block',
  fontSize: 14,
  color: theme.palette.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const HoverableUsername = styled(Typography)(({ theme }) => ({
  display: 'inline-block',
  fontWeight: 500,
  color: theme.palette.text.primary,
  transition: 'all 0.2s ease',
  cursor: 'pointer',

  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'scale(1.05)',
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
  },
}));



const Conversation = ({ user }) => {

  const { account, setAccount, person, setPerson, socket,newMessageFlag, unreadCounts } = useContext(UserContext);
 

  const [message, setMessage] = useState({});
  const [imgSrc, setImgSrc] = useState(user.profilePicture || Profile_icon);

  useEffect(() => {
    setImgSrc(user.profilePicture || Profile_icon);
  }, [user.profilePicture]);

  useEffect(() => {
        const getConversationMessage = async() => {
            const data = await getConversation({ senderId: account._id, receiverId: user._id });
            setMessage({ text: data?.message, timestamp: data?.updatedAt });
        }
        getConversationMessage();
    }, [newMessageFlag]);

  const handleImageError = () => {
    setImgSrc(Profile_icon);
  };


  const getUser = async () => {
  if (!account?._id || !user?._id) {
    console.error('Account or user ID missing:', { account, user });
    return;
  }

  setPerson(user);
  await setConversation({ senderId: account._id, receiverId: user._id });
};


  const hasUnread = unreadCounts?.[user._id] > 0;

  return (
    <Component onClick={ getUser}>
      <Box>
        <Image src={imgSrc} alt="" onError={handleImageError} />
      </Box>
      <Box style={{ width:'100%'}}>
        <Container>
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <HoverableUsername sx={hasUnread ? { fontWeight: 700 } : undefined}>
              {user.username}
            </HoverableUsername>
            <Text sx={hasUnread ? { fontWeight: 500, color: 'text.primary' } : undefined}>
              {message?.text?.includes('localhost') ? 'media': message.text}
            </Text>
          </Box>
          <Box sx={{ ml: 'auto', mr: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
            {message?.text && (
              <Timestamp>{formatDate(message?.timestamp)}</Timestamp>
            )}
            {hasUnread && (
              <Box sx={{ mt: 0.5 }}>
                <Badge
                  color="success"
                  badgeContent={unreadCounts[user._id]}
                  sx={{
                    '& .MuiBadge-badge': {
                      minWidth: 18,
                      height: 18,
                      borderRadius: '50%',
                      fontSize: 11,
                      px: 0.7,
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        </Container>
      </Box>
      
    </Component>
  );
};

export default Conversation;
