
import { ArrowBack, Height } from '@mui/icons-material';
import {Drawer, Typography,Box,styled} from '@mui/material';
import Profile from './Profile';

const Header = styled(Box)`
    background-color: #000000;
    height:195px;
    color: #fff;
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 20px;
`
const Component = styled(Box)`
    background-color: #ededed;
    height:85%;
    `

const drawerStyle = {
    left:20,
    top: 23,
    height: '95%',
    width: '26.5%',
    boxShadow: 'none',
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