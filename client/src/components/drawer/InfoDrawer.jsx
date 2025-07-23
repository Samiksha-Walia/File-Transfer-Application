
import { ArrowBack, Height } from '@mui/icons-material';
import {Drawer, Typography,Box,styled} from '@mui/material';
import Profile from './Profile';

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f5f5f5',
  height: 195,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  gap: 20,
}));

const Component = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: '85%',
}));


const drawerStyle = {
    left:20,
    top: 23,
    height: '95%',
    width: '26.5%',
    boxShadow: 'none',
    backgroundColor: ' theme.palette.background.default', 
}

const InfoDrawer=({open, setOpen})=> {

    const handleClose = () => {
        setOpen(false);}
    return ( 
        <Drawer
            open={open}
            onClose={handleClose}
            PaperProps={{ sx: drawerStyle }}
            style={{ zIndex: 1300 }}
        >
            <Header>
                <ArrowBack onClick={()=>setOpen(false)}/>
                <Typography>
                    Profile
                </Typography>
            </Header>
            <Component>
                <Profile />
            </Component>
        </Drawer>
    );
}

export default InfoDrawer;