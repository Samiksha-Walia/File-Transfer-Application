import {Search as SearchIcon} from '@mui/icons-material';
import {Mic as MicIcon} from '@mui/icons-material';
import {Box, styled,InputBase, useTheme } from '@mui/material';
import { useContext } from 'react';
import UserContext from '../../../context/UserContext';

const Component = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: 45,
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
}));

const Wrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#2e2e2e' : '#f0f2f5',
  position: 'relative',
  margin: '0 13px',
  width: '100%',
  borderRadius: 10,
  border: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  },
}));

const Icon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  height: '100%',
  padding: '6px 10px',
  color: theme.palette.text.secondary,
}));

const MicIconBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 10,
  top: '50%',
  transform: 'translateY(-50%)',
  color: theme.palette.text.secondary,
  cursor: 'pointer',
}));

const InputField = styled(InputBase)(({ theme }) => ({
  width: '100%',
  padding: 16,
  paddingLeft: 65,
  fontSize: 14,
  height: 15,
  color: theme.palette.text.primary,
}));

const Search = ({setText}) => {
    const theme = useTheme();
    const { setVoiceMessage } = useContext(UserContext);

    const handleMicClick = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;

            // Debug: show raw speech-to-text output in console
            console.log('Voice command transcript:', transcript);

            // 1) Try pattern with quotes: send "Hi" to Sam
            let match = transcript.match(/send\s+"(.+?)"\s+to\s+(.+)/i);

            // 2) If that fails, try without quotes: send hi to Sam
            if (!match) {
                match = transcript.match(/send\s+(.+?)\s+to\s+(.+)/i);
            }

            if (!match) {
                console.log('Voice command did not match expected pattern.');
                return;
            }

            const message = match[1].trim();
            const recipientName = match[2].trim();

            setVoiceMessage({ recipientName, message });
            setText(recipientName);
        };

        recognition.start();
    };

    return (
        <Component>
            <Wrapper>
                <Icon>
                    <SearchIcon 
                    fontSize='small'/>
                </Icon>
                <InputField
                    placeholder='Search or start new chat'
                    onChange={(e)=>setText(e.target.value)}
                />
                <MicIconBox onClick={handleMicClick}>
                    <MicIcon fontSize="small" />
                </MicIconBox>
            </Wrapper>
        </Component>
    );
}

export default Search;