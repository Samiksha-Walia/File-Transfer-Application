import { Box, Dialog, Typography, TextField, Button, useTheme  } from '@mui/material';
import { useState } from 'react';
import Light_Blinq from '../../assets/Light_Blinq_copy.png';
import dark_Blinq from '../../assets/dark_Blinq_copy.png';
import axios from 'axios';




const LoginDialog = ({ onSwitch, onLoginSuccess }) => {
    const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const theme = useTheme(); // Access current theme
  const isDarkMode = theme.palette.mode === 'dark';
  const logoSrc = isDarkMode ? dark_Blinq : Light_Blinq;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const dialogStyle = {
  height: 'auto',
  marginTop: '5%',
  width: 420,
  maxWidth: '100%',
  borderRadius: '16px',
  boxShadow: '0px 10px 30px rgba(0,0,0,0.25)',
  overflow: 'hidden',
  padding: '32px 36px 30px',
  backgroundColor: theme.palette.background.paper,
};
  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      setMessage('Login successful!');
      localStorage.setItem('token', res.data.token);
      onLoginSuccess({
      username: res.data.username,
      _id: res.data.userId   // ✅ pass _id to parent
    }) // notify parent
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };
  return (
    <Dialog open={true} PaperProps={{ sx: dialogStyle }} hideBackdrop='true'>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2.5} sx={{ width: '100%' }}>
        <Box sx={{ mb: 0.5 }}>
          <Box
            component="img"
            src={logoSrc}
            alt="Blinq logo"
            sx={{ width: 270, height: 'auto' }}
          />
        </Box>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          Login
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Welcome back! Please enter your details to continue.
        </Typography>

        <TextField
          fullWidth
          name="username"
          label="Username"
          variant="outlined"
          size="small"
          margin="dense"
          autoFocus
          onChange={handleChange}
        />

        <TextField
          fullWidth
          name="password"
          label="Password"
          variant="outlined"
          type="password"
          size="small"
          margin="dense"
          onChange={handleChange}
        />

        <Button
          onClick={handleLogin}
          variant="contained"
          fullWidth
          sx={{
            textTransform: 'none',
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark
            },
            paddingY: 1
          }}
        >
          Login
        </Button>
        
        {message && (
          <Typography color={message.includes('successful') ? 'success.main' : 'error.main'}>
            {message}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary">
            Don’t have an account?{' '}
             <span
                style={{
                  color: theme.palette.primary.main,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
                onClick={onSwitch}
              >
                Register
            </span>
        </Typography>
      </Box>
    </Dialog>
  );
};

export default LoginDialog;
