import { Box, Dialog, Typography, TextField, Button, useTheme } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';




const RegisterDialog = ({ onSwitch, onLoginSuccess }) => {
  const theme = useTheme();

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
  width: '400px',
  maxWidth: '100%',
  borderRadius: '12px',
  boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
  overflow: 'hidden',
  padding: '32px',
  backgroundColor: theme.palette.background.paper
};

  return (
    <Dialog open={true} PaperProps={{ sx: dialogStyle }} hideBackdrop='true'>
      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        <Typography variant="h5" fontWeight={600}>
          Create an Account on Blinq
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

        <TextField
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          variant="outlined"
          type="password"
          size="small"
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

        {message && <Typography color="error">{message}</Typography>}

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
