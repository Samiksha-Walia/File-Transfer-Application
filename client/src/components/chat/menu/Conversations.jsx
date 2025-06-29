import React, { useContext, useState, useEffect } from 'react';
import { Box,Divider , styled } from "@mui/material";
import Conversation from "./Conversation";
import UserContext from '../../../context/UserContext'; 
import axios from "axios";

const Component = styled(Box)`
  height:81vh;
  overflow-y: overlay;
  `;


const StyleDivider = styled(Divider)`
  margin: 0 0 0 70px;
  background-color: #e9edef;
  opacity: 0.6;
`;

const Conversations = ({text}) => {
  const [users, setUsers] = useState([]);
 //onst [activeUsers, setActiveUsers] = useState([]);

  const { account, setAccount, person, setPerson, socket, activeUsers, setActiveUsers } = useContext(UserContext);


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
