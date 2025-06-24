import { useState } from 'react';

import {MoreVert} from '@mui/icons-material';
import {Menu,MenuItem,styled, IconButton} from '@mui/material';

const MenuOption = styled(MenuItem)`
    font-size: 14px;
    padding: 15px 60px 5px 20px;
    color: #4A4A4A
`

const HeaderMenu = ({ onLogout, setOpenDrawer }) => {

    const [open, setOpen] = useState(null);

    const handleClose = () => {
        setOpen(null);
    }

    const handleClick =(e) => {
        setOpen(e.currentTarget);
    }

    const handleLogout = () => {
    handleClose();
    onLogout(); // Call the logout prop passed from parent
  };

  return (
    <>
        <MoreVert onClick={handleClick}/>
        <Menu
            anchorEl={open} 
            keepMounted
            open={open} 
            onClose={handleClose} 
            getContentAnchorEl={null}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            >
            <MenuOption onClick={()=>{handleClose(); setOpenDrawer(true)}}>Profile</MenuOption>
            <MenuOption onClick={handleClose}>Settings</MenuOption>
            <MenuOption onClick={handleLogout}>Logout</MenuOption>
            </Menu>
    </>
  );
}

export default HeaderMenu;