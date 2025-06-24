import { useEffect, useState } from "react";
import { Box,Divider , styled } from "@mui/material";
import Conversation from "./Conversation";
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

const Conversations = () => {
  const [users, setUsers] = useState([]);

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
