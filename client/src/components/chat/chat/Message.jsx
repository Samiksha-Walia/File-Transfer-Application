import { useContext, useState} from 'react';

import { Box,IconButton , Button,CircularProgress, Typography, LinearProgress,styled} from '@mui/material';


import GetAppIcon from '@mui/icons-material/GetApp';
import axios from 'axios';
import { saveAs } from 'file-saver';

import { useTheme } from '@mui/material/styles';

import { formatDate } from '../../../utils/common-utils';
import UserContext from '../../../context/UserContext';

import { fileIcons, getFileType } from '../../../utils/fileIconUtils'; 

const Own = styled(Box)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? 'rgba(200, 200, 200, 0.2)' : 'rgba(202, 202, 202, 0.46)',
    maxWidth: '60%',
    marginLeft: 'auto',
    padding: 5,
    width: 'fit-content',
    display: 'flex',
    borderRadius: 10,
    wordBreak: 'break-word',
}));

const Wrapper = styled(Box)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? 'rgba(45, 45, 45, 0.51)' : '#f5f5f5',
    maxWidth: '60%',
    padding: 5,
    width: 'fit-content',
    display: 'flex',
    borderRadius: 10,
    wordBreak: 'break-word',
}));

const Text =styled(Typography)`
    font-size:14px;
    padding: 0 25px 0 5px;
`;

const Time = styled(Typography)(({ theme }) => ({
    fontSize: 10,
    color: theme.palette.text.secondary,
    marginTop: 'auto',
    wordBreak: 'keep-all'
}));


const PdfWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.action.hover,
    borderRadius: 8,
    padding: 10,
    width: 250,
}));


const PdfHeader = styled(Box)`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const PdfIcon = styled('img')({
    width: 40,
    height: 40
});

const DownloadButton = styled('a')`
    margin-top: 10px;
    text-align: center;
    padding: 5px 10px;
    background-color:rgb(37, 37, 37);
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-size: 14px;
    &:hover {
        background-color:rgb(38, 38, 38);
    }
`;


const CircularProgressWithLabel = ({ value }) => {

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" value={value} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};


export const Message=({message})=>{

   const { account, setAccount, person, setPerson, socket } = useContext(UserContext);
    const [progress, setProgress] = useState(0);
    const theme = useTheme();



    return(
        <>
            {
                account._id === message.senderId ?
                    <Own>
                        {
                            message.type === 'file' ? <ImageMessage message={message}/> : <TextMessage message={message} />
                        }
                        
                    </Own>
                :
                    <Wrapper>
                        {
                            message.type === 'file' ? <ImageMessage message={message}/> : <TextMessage message={message} />
                        }
                    </Wrapper>
                
            }
        </>
        
    )
}


const handleFileUpload = async (file,setProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    await axios.post('/upload', formData, {
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percent);
      }
    });
    setProgress(0); // Reset after upload
  } catch (err) {
    console.error('Upload failed', err);
    setProgress(0);
  }
};


const downloadFile = async (fileUrl, fileName, setProgress, setDownloaded) => {
    try {
        const response = await axios.get(fileUrl, {
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
                const total = progressEvent.total || progressEvent.target?.getResponseHeader('content-length') || 1;
                const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
                setProgress(percentCompleted);
                },

        });

        const blob = new Blob([response.data]);
        saveAs(blob, fileName);
        setProgress(0); // Reset progress after completion
    } catch (error) {
        console.error('Download failed', error);
        setProgress(0);
    }
};

const FileDownloader = ({ fileUrl, fileName }) => {
    const [progress, setProgress] = useState(0);

    const handleDownload = () => {
        downloadFile(fileUrl, fileName, setProgress);
    };

    return (
        <Box
            sx={{
                border: '1px solid #ccc',
                padding: 2,
                borderRadius: 2,
                width: '100%',
                maxWidth: 400
            }}
        >
            <Typography variant="body1">{fileName}</Typography>

            <DownloadButton
                variant="contained"
                onClick={handleDownload}
            >
                Download
            </DownloadButton>

            {progress > 0 && progress < 100 && (
                <Box sx={{ width: '100%', mt: 1 }}>
                    <LinearProgress variant="determinate" value={progress} />
                    <Typography variant="caption">{progress}%</Typography>
                </Box>
            )}
        </Box>
    );
};



const ImageMessage = ({ message }) => {
    const fileName = message?.text ? message.text.split('/').pop() : 'Unknown File';
    const fileType = getFileType(fileName);
    const isImage = fileType === 'image';
    const theme = useTheme();

    const [progress, setProgress] = useState(0);

    const [isDownloaded, setIsDownloaded] = useState(false);

    

    const handleDownload = () => {
        downloadFile(message.text, fileName, setProgress, setIsDownloaded);
        setIsDownloaded(true);
    };

    return (
        <Box style={{ position: 'relative' }}>
            {isImage ? (
                <>
                    <img 
                        src={message.text} 
                        alt={fileName} 
                        style={{ 
                            width: '100%', 
                            maxWidth: 300, 
                            borderRadius: 10, 
                            objectFit: 'contain' 
                        }} 
                    />

                    {/* Circular Download Button Overlay */}
                    <Box
                        
                        onClick={handleDownload}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            borderRadius: '50%',
                            width: 36,
                            height: 36,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: 1,
                            cursor: 'pointer',
                            zIndex: 1
                        }}
                    
                    >
                        <GetAppIcon fontSize="small" sx={{ color: '#333' }} />
                    </Box>
                    {/* Progress Overlay */}
                    {progress > 0 && progress < 100 && (
                        <Box sx={{ position: 'absolute', top: 50, right: 8 }}>
                        <CircularProgressWithLabel value={progress} />
                        </Box>
                    )}
                </>
            ) : (
                <Box 
                    sx={{
                        backgroundColor: theme.palette.action.hover,
                        padding: 2,
                        borderRadius: 2,
                        maxWidth: 320,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    >

                    <Box style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img 
                            src={fileIcons[fileType] || fileIcons.other} 
                            alt={fileType} 
                            style={{ width: 48, height: 48 }} 
                        />
                        <Box>
                            <Typography style={{ fontWeight: 600, fontSize: 14, color: theme.palette.text.primary  }}>
                                {fileName.length > 30 ? fileName.substring(0, 30) + '...' : fileName}
                            </Typography>
                            <Typography style={{ fontSize: 11, color: theme.palette.text.secondary }}>
                                {fileType.toUpperCase()} File
                            </Typography>
                        </Box>
                    </Box>

                    <DownloadButton
                        onClick={handleDownload}
                        style={{
                            cursor: 'pointer',
                            pointerEvents: isDownloaded ? 'none' : 'auto',
                            opacity: isDownloaded ? 0.7 : 1,
                        }}
                    >
                        {isDownloaded ? "Downloaded" : "Download"}
                    </DownloadButton>
                    {progress > 0 && progress < 100 && (
                        <Box sx={{ mt: 1, alignSelf: 'center' }}>
                        <CircularProgressWithLabel value={progress} />
                        </Box>
                    )}
                </Box>
            )}

            {/* Timestamp */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                <Typography
                    sx={{
                        fontSize: 10,
                        color: theme.palette.text.secondary,
                        pr: 0.5, // Optional right padding
                    }}
                >
                    {formatDate(message.createdAt)}
                </Typography>
            </Box>

        </Box>
    );
};



const TextMessage =  ({message}) => {
    return (
        <>
            <Text>
                {message.text}
            </Text>
            <Time>
                {formatDate(message.createdAt)}
            </Time>
        </>
    )
}

export default Message;