import React, { useContext, useState, useEffect, useTheme } from 'react';
import { Box,Divider , styled } from "@mui/material";
import Conversation from "./Conversation";
import UserContext from '../../../context/UserContext'; 
import axios from "axios";

const Component = styled(Box)(({ theme }) => ({
  height: '90vh',
  overflowY: 'overlay',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const StyleDivider = styled(Divider)(({ theme }) => ({
  margin: '0 0 0 70px',
  backgroundColor: theme.palette.divider,
  opacity: 0.6,
}));


const Conversations = ({text}) => {
  const [users, setUsers] = useState([]);
 //onst [activeUsers, setActiveUsers] = useState([]);

  const { account, setAccount, person, setPerson, socket, activeUsers, setActiveUsers, voiceMessage } = useContext(UserContext);


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/auth/other-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const filteredData = res.data.filter((user) =>
          user.username.toLowerCase().includes(text.toLowerCase())
        );
        setUsers(filteredData);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };

    fetchData();
  }, [text]);

  useEffect(() => {
    if (account?._id) {
        socket.current.emit('addUsers', account);
    }

    socket.current.on('getUsers', (users) => {
        setActiveUsers(users);
    });

    return () => {
        socket.current.off('getUsers');
    };
}, [account]);

  // When a voice command specifies a recipient name, auto-select that user
  useEffect(() => {
    if (!voiceMessage || !voiceMessage.recipientName) return;

    const normalizedTarget = voiceMessage.recipientName.toLowerCase();
    console.log('VoiceMessage received in Conversations:', voiceMessage, 'normalized target:', normalizedTarget);
    const targetUser = users.find(u => u.username.toLowerCase() === normalizedTarget);

    if (targetUser) {
      console.log('Auto-selecting user from voice command:', targetUser);
      setPerson(targetUser);
    } else {
      console.log('No matching user found for voice recipient name. Available users:', users.map(u => u.username));
    }
  }, [voiceMessage, users, setPerson]);


  return (
    <Component>
      {users.map((user) => (
        <>
        <Conversation key={user._id} user={user} />
        <StyleDivider />
        </>
      ))}
    </Component>
  );
};

export default Conversations;
