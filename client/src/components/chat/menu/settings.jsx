import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Paper,
  styled
} from '@mui/material';
import axios from 'axios';

const Container = styled(Paper)(({ theme }) => ({
  maxWidth: 500,
  margin: '40px 20px',
  padding: '24px',
  borderRadius: 12,
  backgroundColor: theme.palette.background.default,
}));

const Section = styled(Box)`
  margin-bottom: 32px;
`;

const Settings = ({ currentTheme, toggleTheme }) => {
  console.log('Current theme at line 27 :', currentTheme);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMsg('New passwords do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/auth/change-password',
        {
          oldPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPasswordMsg('Password changed successfully.');
    } catch (err) {
      console.error(err);
      setPasswordMsg('Failed to change password. Please check your current password.');
    }
  };

  return (
    <Container elevation={3}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>

      {/* Theme Toggle */}
      <Section>
        <Typography variant="h6">Appearance</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={currentTheme === 'dark'}
              onChange={() => {
                console.log('Switch toggled');
                toggleTheme();
              }}
            />
          }
          label={currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        />

      </Section>

      {/* Password Change */}
      <Section>
        <Typography variant="h6">Change Password</Typography>
        <TextField
          fullWidth
          type="password"
          label="Current Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          type="password"
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          type="password"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handlePasswordChange}
          sx={{ mt: 2 }}
        >
          Update Password
        </Button>
        {passwordMsg && (
          <Typography color="error" sx={{ mt: 1 }}>
            {passwordMsg}
          </Typography>
        )}
      </Section>
    </Container>
  );
};

export default Settings;
