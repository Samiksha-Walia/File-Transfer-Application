
import {Box, styled} from '@mui/material';
import Background from '../../../assets/Background.png';
import Footer from "./Footer";

const Wrapper = styled(Box)`
    
    background-color: #f5f5f5; /* Light gray, change as needed */
    background-size: 100%;
    `;

const Component = styled(Box)`
    height: 80vh;
    overflow-y: scroll;
`;

const Messages=()=>
{
    return(
        <Wrapper>
            <Component>

            </Component>
            <Footer />
        </Wrapper>
    )
}

export default Messages;