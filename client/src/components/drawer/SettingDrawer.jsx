import { ArrowBack } from '@mui/icons-material';
import { Drawer, Typography, Box, styled } from '@mui/material';
import Settings from '../chat/menu/settings'; // Import your Settings component

const Header = styled(Box)`
  background-color: #000;
  height: 195px;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 20px;
`;

const Component = styled(Box)`
  background-color: #ededed;
  height: 85%;
`;

const drawerStyle = {
  left: 20,
  top: 23,
  height: '95%',
  width: '26.5%',
  boxShadow: 'none',
};

const SettingsDrawer = ({ open, setOpen, currentTheme, toggleTheme }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: drawerStyle }}
      style={{ zIndex: 1300 }}
    >
      <Header>
        <ArrowBack onClick={handleClose} />
        <Typography>Settings</Typography>
      </Header>
      <Component>
        <Settings currentTheme={currentTheme} toggleTheme={toggleTheme} />
      </Component>
    </Drawer>
  );
};

export default SettingsDrawer;
