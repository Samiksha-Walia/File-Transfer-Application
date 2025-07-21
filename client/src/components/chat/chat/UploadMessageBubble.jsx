import { Box, Typography, IconButton, CircularProgress, Tooltip } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const UploadMessageBubble = ({ file, onSuccess, onCancel }) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const cancelTokenRef = useRef(null);

  const uploadFile = async () => {
    setError(false);
    const data = new FormData();
    data.append("file", file);

    cancelTokenRef.current = axios.CancelToken.source();

    try {
      const res = await axios.post('http://localhost:5000/upload', data, {
        cancelToken: cancelTokenRef.current.token,
        onUploadProgress: (e) => {
            if (e.total) {
                const percent = Math.round((e.loaded * 100) / e.total);
                setProgress(percent);
            } else {
                // fallback: simulate percentage if `e.total` is unavailable
                setProgress(prev => Math.min(prev + 10, 90));
            }
            },

      });

      onSuccess(res?.data?.fileUrl ? { fileUrl: res.data.fileUrl } : null);
    } catch (err) {
      if (axios.isCancel(err)) return;
      setError(true);
    }
  };

  useEffect(() => {
    uploadFile();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        margin: 2,
        backgroundColor: '#e3f2fd',
        padding: '8px 12px',
        borderRadius: 2,
        maxWidth: '70%',
        alignSelf: 'flex-end',
        gap: 1
      }}
    >
      <Typography variant="body2" noWrap sx={{ flex: 1 }}>
        {file.name}
      </Typography>

      {error ? (
        <Tooltip title="Retry">
          <IconButton onClick={uploadFile}>
            <ReplayIcon color="error" />
          </IconButton>
        </Tooltip>
      ) : (
        <CircularProgress size={20} variant="determinate" value={progress} />
      )}

      <Tooltip title="Cancel">
        <IconButton onClick={() => {
          cancelTokenRef.current?.cancel();
          onCancel();
        }}>
          <CancelIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default UploadMessageBubble;
