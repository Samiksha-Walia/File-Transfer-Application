import {useContext, useState, useEffect} from 'react';

import {Box , styled} from '@mui/material';
import{Chat as MessageIcon} from '@mui/icons-material';

import Profile_icon from '../../../assets/Profile_icon.png';
import HeaderMenu from './HeaderMenu';
import InfoDrawer from '../../drawer/InfoDrawer';
import axios from 'axios';

const Component=styled(Box)`
    height: 44px;
    background-color:#ededed;
    padding: 8px 16px;
    display: flex; 
    align-items: center;`

const Wrapper=styled(Box)`
    margin-left: auto;
    & > * {
        margin-left: 20px;
        padding: 8px;
        color: #000;
    };
    & :first-child {
        font-size: 22px;
        margin-right: 8px;}`

const Image=styled('img')`
    height: 36px;
    width: 36px;    
    border-radius: 50%;
    object-fit: cover;`



const Header = ({ onLogout }) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [user, setUser] = useState({ profilePicture: '' });

    const toggleDrawer = () => {
        setOpenDrawer(true);}
        
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user for header:', err);
      }
    };

    fetchUser();
  }, []);
    return(
        <>
        <Component>
         <Image src={user.profilePicture || Profile_icon} alt="Profile_icon" onClick={()=>toggleDrawer()}/>

        <Wrapper>
            <MessageIcon  />
            <HeaderMenu setOpenDrawer={setOpenDrawer} onLogout={onLogout}/>
        </Wrapper>
        </Component>
        <InfoDrawer open={openDrawer} setOpen={setOpenDrawer}/>
        </>
    )
}

export default Header;  