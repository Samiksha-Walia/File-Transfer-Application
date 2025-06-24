import Blinq from '../../../assets/Blinq.png';
import {Box, Typography, styled, Divider} from '@mui/material';

const Component= styled(Box)`
    background: #f8f9fa;
    padding: 75px 0;
    text-align: center;
    height: 100%;
`;
const Container = styled(Box)`
    padding: 0 200px;
    margin-top: 100px;
`;

const Image = styled('img')`
    width: 400px;
`;
const Title = styled(Typography)`
    font-size: 32px;
    margin: 25px 0 10px 0;
    font-family: inherit;
    font-weight: 300;
    color: #41525d;
`;

const SubTitle = styled(Typography)`
    font-size: 16px;
    color: #667781;
    font-weight: 400;
    font-family: inherit;
    `;
const StyleDivider = styled(Divider)`  
    margin: 40px 0;
    opacity:1;
`;
const EmptyChat = () => {
    return (
        <Component>
            <Container>
                <Image src={Blinq} alt="Blinq Logo"  />
                <Title>Welcome to Blinq</Title>
                
                <SubTitle>Files. Chats. Blinq. </SubTitle >
                <SubTitle>One tap, and it's there.</SubTitle>
                
            </Container>
        </Component>
    );
};
export default EmptyChat;