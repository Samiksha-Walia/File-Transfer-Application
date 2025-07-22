import { useState } from 'react';

import {MoreVert} from '@mui/icons-material';
import {Menu,MenuItem,styled, IconButton, useTheme} from '@mui/material';

const MenuOption = styled(MenuItem)(({ theme }) => ({
  fontSize: 14,
  padding: '15px 60px 5px 20px',
  color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#4A4A4A',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const HeaderMenu = ({ onLogout, setOpenDrawer, setOpenSettings  }) => {

    const [open, setOpen] = useState(null);
    const theme = useTheme(); 

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
        <IconButton onClick={handleClick}>
            <MoreVert style={{ color: theme.palette.text.primary }} />
      </IconButton>
        <Menu
            anchorEl={open} 
            keepMounted
            open={Boolean(open)} 
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
            PaperProps={{
                sx: {
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.shadows[5],
                },
                }}
            >
            <MenuOption onClick={()=>{handleClose(); setOpenDrawer(true)}}>Profile</MenuOption>
            <MenuOption onClick={() => { handleClose(); setOpenSettings(true);}}>Settings</MenuOption>
            <MenuOption onClick={handleLogout}>Logout</MenuOption>
        </Menu>
    </>
  );
}

export default HeaderMenu;