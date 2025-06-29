import { useContext, useState} from 'react';

import { Box, Button, Typography, LinearProgress,styled} from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import axios from 'axios';
import { saveAs } from 'file-saver';


import { formatDate } from '../../../utils/common-utils';
import UserContext from '../../../context/UserContext';

import { fileIcons, getFileType } from '../../../utils/fileIconUtils'; 

const Own =styled(Box)`
    background:rgba(202, 202, 202, 0.46);
    max-width:60%;
    margin-left:auto;
    padding:5px;
    width: fit-content;
    display:flex;
    border-radius: 10px;
    word-break: break-word;
`;

const Wrapper =styled(Box)`
    background:#FFFFFF;
    max-width:60%;
    padding:5px;
    width: fit-content;
    display:flex;
    border-radius: 10px;
    word-break: break-word;
`;

const Text =styled(Typography)`
    font-size:14px;
    padding: 0 25px 0 5px;
`;

const Time =styled(Typography)`
    font-size:10px;
    color: #919191;
    margin-top: 6px;
    word-break: keep-all;
    margin-top: auto;
`;

const PdfWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    background-color: #f0f0f0;
    border-radius: 8px;
    padding: 10px;
    width: 250px;
`;

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





export const Message=({message})=>{

   const { account, setAccount, person, setPerson, socket } = useContext(UserContext);
    const [progress, setProgress] = useState(0);


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


const downloadFile = async (fileUrl, fileName, setProgress) => {
    try {
        const response = await axios.get(fileUrl, {
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                setProgress(percentCompleted);
            }
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

    const [progress, setProgress] = useState(0);

    const [isDownloaded, setIsDownloaded] = useState(false);

    

    const handleDownload = () => {
        downloadFile(message.text, fileName, setProgress);
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
                </>
            ) : (
                <Box 
                    style={{
                        background: '#f0f0f0',
                        padding: 10,
                        borderRadius: 10,
                        maxWidth: 320,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Box style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img 
                            src={fileIcons[fileType] || fileIcons.other} 
                            alt={fileType} 
                            style={{ width: 48, height: 48 }} 
                        />
                        <Box>
                            <Typography style={{ fontWeight: 600, fontSize: 14 }}>
                                {fileName.length > 30 ? fileName.substring(0, 30) + '...' : fileName}
                            </Typography>
                            <Typography style={{ fontSize: 11, color: '#555' }}>
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

                </Box>
            )}

            {/* Timestamp */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                <Typography
                    sx={{
                        fontSize: 10,
                        color: '#919191',
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