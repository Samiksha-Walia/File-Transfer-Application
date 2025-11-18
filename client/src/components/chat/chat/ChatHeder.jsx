import { Box, Typography, styled, useTheme, Menu, MenuItem,IconButton , SwipeableDrawer,Divider } from "@mui/material";
import { Search, MoreVert } from "@mui/icons-material";
import {useContext, useState, useEffect} from 'react';
import UserContext from "../../../context/UserContext";
import Profile_icon from '../../../assets/Profile_icon.png';
import axios from "axios";

const Header = styled(Box)(({ theme }) => ({
  height: 60,
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Image = styled('img')({
  width: 40,
  height: 40,
  borderRadius: '50%',
  objectFit: 'cover',
});

const Name = styled(Typography)(({ theme }) => ({
  marginLeft: 12,
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

const Status = styled(Typography)(({ theme }) => ({
  marginLeft: 12,
  fontSize: 12,
  color: theme.palette.text.secondary,
}));

const RightContainer = styled(Box)(({ theme }) => ({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  '& > svg': {
    padding: 8,
    fontSize: 40,
    color: theme.palette.text.primary,
  },
}));

const MenuOption = styled(MenuItem)(({ theme }) => ({
  fontSize: 14,
  padding: '15px 60px 5px 20px',
  color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#4A4A4A',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));



const ChatHeader = ({person, setOpenDrawer}) => {
  const [open, setOpen] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

    const handleClose = () => {
        setOpen(null);
    }

    const handleClick =(e) => {
        setOpen(e.currentTarget);
    }

   

      const [users, setUsers] = useState([]);

      const {activeUsers} = useContext(UserContext);

      const theme = useTheme();
    
      useEffect(() => {
        const fetchData = async () => {
          const token = localStorage.getItem("token");
          try {
            const res = await axios.get("http://localhost:5000/api/auth/other-users", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setUsers(res.data);
          } catch (err) {
            console.error("Error fetching users", err);
          }
        };
    
        fetchData();
      }, []);
    return(
        <>
        <Header>
            <Image
              src={person?.profilePicture || Profile_icon}
              alt="dp"
              onClick={(e) => setProfileAnchorEl(e.currentTarget)}
              style={{ cursor: 'pointer' }}
            />
            <Box>
                <Name>{person.username}</Name>
                <Status>
                  {activeUsers.find(user => user._id === person._id) ? 'Online' : 'Offline'}
                </Status>

            </Box>
            
        </Header>
        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={() => setProfileAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{
            sx: {
              mt: 1,
              px: 2,
              py: 2,
              minWidth: 260,
              borderRadius: 2,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
            <Image src={person?.profilePicture || Profile_icon} alt="dp" />
            <Box>
              <Typography variant="subtitle1">{person?.username}</Typography>
              <Typography variant="body2" color="text.secondary">
                {activeUsers.find(user => user._id === person._id) ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              About
            </Typography>
            <Typography variant="body2">
              {person?.about || 'Hey there! I am using FTA.'}
            </Typography>
          </Box>

         
        </Menu>
        </>
    )
};
export default ChatHeader;
