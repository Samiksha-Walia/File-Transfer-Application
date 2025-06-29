import { Box, Typography, styled } from "@mui/material";
import { Search, MoreVert } from "@mui/icons-material";
import {useContext, useState, useEffect} from 'react';
import UserContext from "../../../context/UserContext";
import Profile_icon from '../../../assets/Profile_icon.png';
import axios from "axios";

const Header = styled(Box)`
  height: 44px;
  background-color: #ededed;
  display: flex;
  align-items: center;
  padding: 8px 16px;
`;

const Image = styled('img')({
  width: 40,
  height: 40,
  borderRadius: '50%',
  objectFit: 'cover',
});

const Name= styled(Typography)`
  margin-left: 12px !important; ;
`;

const Status= styled(Typography)`
  margin-left: 12px !important; 
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
`;

const RightContainer = styled(Box)`
  margin-left: auto;
  & > svg {
    padding: 8px;
    font-size: 24px;
    color: #000;
  }
`;

const ChatHeader = ({person}) => {

      const [users, setUsers] = useState([]);

      const {activeUsers} = useContext(UserContext);
    
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
