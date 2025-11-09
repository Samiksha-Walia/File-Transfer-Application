import { useState,useEffect} from "react";

import {Box,Typography,InputBase ,styled,IconButton  } from "@mui/material";
import { EmojiEmotionsOutlined,AttachFile, Mic} from "@mui/icons-material";
import SendIcon from '@mui/icons-material/Send';

import { uploadFile } from "../../../service/api";

import { Picker } from 'emoji-mart';

import 'emoji-mart/css/emoji-mart.css';

const Container = styled(Box)(({ theme }) => ({
    height: 55,
    background: theme.palette.mode === 'dark' ? '#2a2f32' : '#ededed',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    padding: '0 15px',
    '& > *': {
        margin: 5,
        color: theme.palette.text.secondary,
    }
}));

const Search = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: 18,
    width: 'calc(94% - 100px)',
}));


const InputField = styled(InputBase)(({ theme }) => ({
    width: '100%',
    padding: 20,
    height: 20,
    paddingLeft: 25,
    fontSize: 14,
    color: theme.palette.text.primary,
}));

const ClipIcon = styled(AttachFile)`
    transform: rotate(40deg);
`;

const EmojiPickerWrapper = styled(Box)`
  position: absolute;
  bottom: 80px;
  left: 75;
  z-index: 1200;
`;


const FilePreviewWrapper = styled(Box)({
  display: 'flex',
  gap: 10,
  padding: '5px 0',
  overflowX: 'auto',
});

const FilePreviewItem = styled(Box)({
  position: 'relative',
  width: 80,
  height: 80,
  borderRadius: 12,
  border: '1px solid #ccc',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  textAlign: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s',
  '&:hover': { transform: 'scale(1.05)' },
});

const CloseButton = styled(Box)({
  position: 'absolute',
  top: 2,
  right: 2,
  background: 'rgba(0,0,0,0.5)',
  color: '#fff',
  borderRadius: '50%',
  width: 18,
  height: 18,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: 12,
});

const Footer = ({sendText,setValue,value,file,setFile, setImage, onFileSelect }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [progress, setProgress] = useState({}); 
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // useEffect(()=>{
    //     const getImage=async()=>{
    //         if (file){
    //             const data = new FormData();
    //             data.append("name",file.name);
    //             data.append("file",file);

    //             let response=await uploadFile(data,setProgress);
    //             console.log(response);
    //             setImage(response.data.url);
                
    //             if (response) {
    //                 setTimeout(() => setProgress(0), 1000);
    //             }
            
    //         }

    //     }
    //     getImage();
    // },[file])


    const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };


const handleSend = async (e) => {
    try {
        e.preventDefault();
        if (!value.trim() && selectedFiles.length === 0) return;

        const uploadedFiles = [];
        let hasError = false;

        // Upload all files first
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const formData = new FormData();
            formData.append('file', file);  // Changed: removed 'name' field as it's not needed

            const setFileProgress = (p) => {
                setProgress(prev => ({ ...prev, [i]: p }));
            };

            try {
                console.log('Uploading file:', file.name);  // Debug log
                const response = await uploadFile(formData, setFileProgress);
                console.log('Upload response:', response);  // Debug log

                if (response?.data?.url) {
                    uploadedFiles.push({
                        url: response.data.url,
                        name: response.data.name,
                        type: response.data.type,
                        size: response.data.size
                    });
                } else {
                    throw new Error('Invalid upload response');
                }
            } catch (error) {
                console.error(`Failed to upload file ${file.name}:`, error);
                hasError = true;
                continue;
            }
        }

        // Send the message with uploaded files
        if ((uploadedFiles.length > 0 || value.trim()) && !hasError) {
            await sendText(e, uploadedFiles);
            // Reset state only after successful send
            setValue('');
            setSelectedFiles([]);
            setProgress({});
        }
    } catch (error) {
        console.error('Error in handleSend:', error);
        // You could add a visual error message here
    }
};




    const handleEmojiSelect = (emoji) => {
    setValue((prev) => prev + emoji.native);
  };

  return (
    <Container>
        <IconButton 
            sx={{ color: (theme) => theme.palette.text.secondary }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
            <EmojiEmotionsOutlined/>
        </IconButton>
            {showEmojiPicker && (
            <EmojiPickerWrapper>
            <Picker
                onSelect={handleEmojiSelect}
                theme="auto"
                showPreview={false}
                showSkinTones={false}
            />
            </EmojiPickerWrapper>
        )}
       
        <label htmlFor="fileInput">
    <IconButton component="span" sx={{ color: (theme) => theme.palette.text.secondary }}>
        <ClipIcon />
    </IconButton>
</label>

<input 
    type="file" 
    id="fileInput" 
    style={{ display:'none' }} 
    onChange={onFileChange} 
    accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt" 
    multiple 
/>

      
        <Search>
        {/* File Preview */}
        {selectedFiles.length > 0 && (
          <FilePreviewWrapper>
            {selectedFiles.map((file, index) => {
              const url = URL.createObjectURL(file);
              return (
                <FilePreviewItem key={index}>
                  {file.type.startsWith('image/') ? (
                    <img src={url} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Box>
                        <Typography variant="caption">{file.name}</Typography>
                    </Box>
                  )}

                  <CloseButton onClick={() => removeFile(index)}>×</CloseButton>
                  
                  {progress[index] > 0 && progress[index] < 100 && (
                     <Box sx={{
                        position: 'absolute', bottom: 0, left: 0, width: '100%',
                        height: 4, backgroundColor: '#d0d0d0'
                    }}>
                        <Box sx={{
                        width: `${progress[index]}%`,
                        height: '100%',
                        backgroundColor: '#128c7e',
                        transition: 'width 0.3s'
                        }} />
                    </Box>
                  )}
                </FilePreviewItem>
              );
            })}
          </FilePreviewWrapper>
        )}

        <InputField placeholder='Type a message'
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </Search>
        
        <IconButton 
            sx={{ color: (theme) => theme.palette.text.secondary }}
            onClick={handleSend} 
            >
            <SendIcon />
        </IconButton>
    </Container>
  );
};

export default Footer;