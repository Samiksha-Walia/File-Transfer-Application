import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  styled,
  Typography,
  Input,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip, 
  TextField, 
  Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Check';
import Profile_icon from '../../assets/Profile_icon.png';

const ImageContainer = styled(Box)`
  display: flex;
  justify-content: center;
  position: relative;
  width: 200px;
  margin: auto;
`;

const StyledAvatar = styled(Avatar)`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  margin-top: 20px;
`;

const EditOverlay = styled(Box)`
  position: absolute;
  top: 20px;
  width: 200px;
  height: 200px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BoxWrapper = styled(Box)`
  background-color: #ffffff;
  padding: 12px 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  & :first-of-type {
    font-size: 13px;
    color: #878787;
    font-weight: 600;
  }

  & :last-of-type {
    margin: 14px 0;
    color: #4a4a4a;
  }
`;

const DescriptionContainer = styled(Box)`
  padding: 15px 20px 28px 30px;

  & p {
    font-size: 13px;
    color: #8696a0;
  }
`;

const FileInput = styled(Input)`
  display: none;
`;

const Profile = () => {
  const [user, setUser] = useState({ username: '', profilePicture: '' });
  const [about, setAbout] = useState('');
  const [hover, setHover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
        setAbout(res.data.about || '');
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/upload-profile-picture',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setUser((prev) => ({ ...prev, profilePicture: res.data.imageUrl }));
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const handleSave = async () => {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.put(
      'http://localhost:5000/api/auth/update-profile',
      {
        username: user.username,
        about,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setUser({
      username: res.data.username,
      profilePicture: res.data.profilePicture,
    });
    setAbout(res.data.about);

    setIsEditingName(false);
    setIsEditingAbout(false);
  } catch (err) {
    console.error('Failed to update profile:', err);
  }
};


  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRemoveImage = async () => {
  const token = localStorage.getItem('token');

  try {
    await axios.delete('http://localhost:5000/api/auth/remove-profile-picture', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUser((prev) => ({ ...prev, profilePicture: '' }));
    handleMenuClose();
  } catch (err) {
    console.error('Error removing profile picture:', err);
  }
};


  const handleViewImage = () => {
    window.open(user.profilePicture || Profile_icon, '_blank');
    handleMenuClose();
  };

  return (
    <>
      <ImageContainer
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <StyledAvatar
          alt="Profile"
          src={user.profilePicture || Profile_icon}
        />

        {hover && (
          <EditOverlay>
            <Tooltip title="Edit">
              <IconButton onClick={handleMenuClick} sx={{ color: '#fff' }}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </EditOverlay>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleRemoveImage}>Remove image</MenuItem>
          <MenuItem onClick={handleViewImage}>View image</MenuItem>
          <MenuItem component="label" htmlFor="profile-upload">Change image</MenuItem>

        </Menu>

        <FileInput
          id="profile-upload"
          type="file"
          onChange={handleImageChange}
          accept="image/*"
        />
      </ImageContainer>

      <BoxWrapper>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>Your Name</Typography>
          <IconButton onClick={() => setIsEditingName(!isEditingName)} size="small">
            {isEditingName ? <SaveIcon onClick={handleSave} /> : <EditIcon />}
          </IconButton>
        </Box>
        {isEditingName ? (
          <TextField
            fullWidth
            size="small"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
        ) : (
          <Typography>{user.username}</Typography>
        )}
      </BoxWrapper>

      <DescriptionContainer>
        <Typography>This is your username. It will be visible to other users.</Typography>
      </DescriptionContainer>

      <BoxWrapper>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>About</Typography>
          <IconButton onClick={() => setIsEditingAbout(!isEditingAbout)} size="small">
            {isEditingAbout ? <SaveIcon onClick={handleSave} /> : <EditIcon />}
          </IconButton>
        </Box>
        {isEditingAbout ? (
          <TextField
            fullWidth
            size="small"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        ) : (
          <Typography>{about || 'Update your profile anytime.'}</Typography>
        )}
      </BoxWrapper>
    </>
  );
};

export default Profile;
