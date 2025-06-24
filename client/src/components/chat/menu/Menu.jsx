import {Box} from '@mui/material';

import Header from './Header';
import Search from './Search';
import HeaderMenu from './HeaderMenu';
import Conversations from './Conversations';

const Menu =({ onLogout })=> {
    return(
        <Box>
            <Header onLogout={onLogout} />
            <Search />
            <Conversations />
        </Box>
    )
}

export default Menu;