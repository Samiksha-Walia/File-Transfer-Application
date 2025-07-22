import { Box, Typography, styled, useTheme  } from "@mui/material";
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
    fontSize: 24,
    color: theme.palette.text.primary,
  },
}));

const ChatHeader = ({person}) => {

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
        <Header>
            <Image src={person?.profilePicture || Profile_icon} alt="dp"/>
            <Box>
                <Name>{person.username}</Name>
                <Status>
                  {activeUsers.find(user => user._id === person._id) ? 'Online' : 'Offline'}
                </Status>

            </Box>
            <RightContainer>
                <Search />
                <MoreVert />
            </RightContainer>
        </Header>
    )
};
export default ChatHeader;
