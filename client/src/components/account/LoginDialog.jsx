import { Box, Dialog, Typography, TextField, Button, useTheme  } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';




const LoginDialog = ({ onSwitch, onLoginSuccess }) => {
    const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const theme = useTheme(); // Access current theme
  const isDarkMode = theme.palette.mode === 'dark';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const dialogStyle = {
  height: 'auto',
  marginTop: '10%',
  width: '400px',
  maxWidth: '100%',
  borderRadius: '12px',
  boxShadow: theme.shadows[10],
  overflow: 'hidden',
  padding: '32px',
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
      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          Login to Blinq
        </Typography>

        <TextField
          fullWidth
          name="username"
          label="Username"
          variant="outlined"
          size="small"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          name="password"
          label="Password"
          variant="outlined"
          type="password"
          size="small"
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
