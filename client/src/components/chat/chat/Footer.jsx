import { useState,useEffect} from "react";

import {Box,Typography,InputBase ,styled,IconButton  } from "@mui/material";
import { EmojiEmotionsOutlined,AttachFile, Mic} from "@mui/icons-material";
import SendIcon from '@mui/icons-material/Send';

import { uploadFile } from "../../../service/api";

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

const Footer = ({sendText,setValue,value,file,setFile, setImage}) => {
    const [progress, setProgress] = useState(0);

    useEffect(()=>{
        const getImage=async()=>{
            if (file){
                const data = new FormData();
                data.append("name",file.name);
                data.append("file",file);

                let response=await uploadFile(data,setProgress);
                console.log(response);
                setImage(response.data.url);
                
                if (response) {
                    setTimeout(() => setProgress(0), 1000);
                }
            
            }

        }
        getImage();
    },[file])


    const onFileChange =(e)=>{
        console.log(e);
        setFile(e.target.files[0]);
        setValue(e.target.files[0].name);
    }

  return (
    <Container>
        <IconButton 
            sx={{ color: (theme) => theme.palette.text.secondary }}
            
            >
            <EmojiEmotionsOutlined/>
        </IconButton>
       
        <label htmlFor="fileInput">
             <IconButton sx={{ color: (theme) => theme.palette.text.secondary }}>
                <ClipIcon/>
            </IconButton>
        </label>
        
        <input 
            type="file"
            id="fileInput"
            style={{display:'none'}}
            onChange={(e)=>onFileChange(e)}
            />
        <Search>
            {progress > 0 && progress < 100 && (
                <Box sx={{ width: '100%', mt: 1, px: 2 }}>
                    <Typography variant="caption" sx={{ fontSize: '12px' }}>
                        Uploading: {progress}%
                    </Typography>
                    <Box sx={{ width: '100%' }}>
                        <Box
                            sx={{
                                height: 4,
                                backgroundColor: '#d0d0d0',
                                borderRadius: 2,
                                overflow: 'hidden'
                            }}
                        >
                            <Box
                                sx={{
                                    height: '100%',
                                    width: `${progress}%`,
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === 'dark' ? '#25d366' : '#128c7e',
                                    transition: 'width 0.3s ease'
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            )}

            <InputField placeholder='Type a message'
            onChange={(e)=>setValue(e.target.value)}
            onKeyDown={(e)=> sendText(e)}
            value={value}/>
        </Search>
        <IconButton sx={{ color: (theme) => theme.palette.text.secondary }}>
            <Mic />
        </IconButton>
        <IconButton 
            sx={{ color: (theme) => theme.palette.text.secondary }}
            onClick={(e) => sendText(e)}
            >
            <SendIcon />
        </IconButton>
    </Container>
  );
};

export default Footer;