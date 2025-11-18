import { Box, Dialog, Typography, TextField, Button, useTheme } from '@mui/material';
import { useState } from 'react';
import Light_Blinq from '../../assets/Light_Blinq_copy.png';
import dark_Blinq from '../../assets/dark_Blinq_copy.png';
import axios from 'axios';




const RegisterDialog = ({ onSwitch, onLoginSuccess }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const logoSrc = isDarkMode ? dark_Blinq : Light_Blinq;

    const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    setMessage('Passwords do not match');
    return;
  }

  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      username: form.username,
      password: form.password
    });
    setMessage(res.data.message || 'Registration successful! Please login.');
    setTimeout(() => {
      onSwitch(); // switch to login form
    }, 1500); // delay optional
  } catch (err) {
    setMessage(err.response?.data?.error || 'Registration failed');
  }
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
        <Typography variant="h5" fontWeight={700}>
          Create an Account on Blinq
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Sign up to start chatting instantly.
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

        <TextField
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          variant="outlined"
          type="password"
          size="small"
          margin="dense"
          onChange={handleChange}
        />


        <Button
          onClick={handleRegister}
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
          Sign Up
        </Button>

        {message && (
          <Typography
            variant="body2"
            sx={{ mt: 0.5 }}
            color={message.toLowerCase().includes('success') ? 'success.main' : 'error.main'}
          >
            {message}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <span
            style={{
              color: theme.palette.primary.main,
              cursor: 'pointer'
            }}
            onClick={onSwitch}
          >

                Login
            </span>
        </Typography>
      </Box>
    </Dialog>
  );
};

export default RegisterDialog;
