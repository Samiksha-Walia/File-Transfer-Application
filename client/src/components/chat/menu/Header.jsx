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
     height: 36px;
    width: 36px; 
    border-radius: 50%;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }
    display: flex;
    justify-content: center;
    align-items: center;`

const Image=styled('img')`
    height: 36px;
    width: 36px;    
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }`





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
          
            <HeaderMenu setOpenDrawer={setOpenDrawer} onLogout={onLogout}/>

        </Wrapper>
        </Component>
        <InfoDrawer open={openDrawer} setOpen={setOpenDrawer}/>
        </>
    )
}

export default Header;  