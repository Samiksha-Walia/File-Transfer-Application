import Light_Blinq from '../../../assets/Light_Blinq.png';
import dark_Blinq from '../../../assets/dark_Blinq.png';
import {Box, Typography, styled, useTheme,Divider} from '@mui/material';

const Component = styled(Box)(({ theme }) => ({
  background: theme.palette.background.default,
  padding: '75px 0',
  textAlign: 'center',
  height: '100%',
}));
const Container = styled(Box)`
    padding: 0 200px;
    margin-top: 100px;
`;

const Image = styled('img')`
    width: 400px;
`;

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '32px',
  margin: '25px 0 10px 0',
  fontFamily: 'inherit',
  fontWeight: 300,
  color: theme.palette.text.primary,
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 400,
  fontFamily: 'inherit',
  color: theme.palette.text.secondary,
}));

const StyleDivider = styled(Divider)`  
    margin: 40px 0;
    opacity:1;
`;
const EmptyChat = () => {
    const theme = useTheme();
    const imageSrc = theme.palette.mode === 'dark' ? dark_Blinq : Light_Blinq;

    return (
        <Component>
            <Container>
                <Image src={imageSrc} alt="Blinq Logo"  />
                <Title>Welcome to Blinq</Title>
                
                <SubTitle>Files. Chats. Blinq. </SubTitle >
                <SubTitle>One tap, and it's there.</SubTitle>
                
            </Container>
        </Component>
    );
};
export default EmptyChat;