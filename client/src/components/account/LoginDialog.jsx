import { Box, Dialog, Typography, TextField, Button } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';


const dialogStyle = {
  height: 'auto',
  marginTop: '10%',
  width: '400px',
  maxWidth: '100%',
  borderRadius: '12px',
  boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
  overflow: 'hidden',
  padding: '32px',
  backgroundColor: '#fff'
};

const LoginDialog = ({ onSwitch, onLoginSuccess }) => {
    const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      setMessage('Login successful!');
      localStorage.setItem('token', res.data.token);
      onLoginSuccess(res.data.username); // notify parent
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };
  return (
    <Dialog open={true} PaperProps={{ sx: dialogStyle }} hideBackdrop='true'>
      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        <Typography variant="h5" fontWeight={600}>
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
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0'
            },
            paddingY: 1
          }}
        >
          Login
        </Button>
        
        {message && <Typography color="error">{message}</Typography>}

        <Typography variant="body2" color="text.secondary">
            Don’t have an account?{' '}
            <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={onSwitch}>
                Register
            </span>
        </Typography>
      </Box>
    </Dialog>
  );
};

export default LoginDialog;
