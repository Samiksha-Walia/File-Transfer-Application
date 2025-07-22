import {Box} from '@mui/material';

import {useState} from 'react';

import Header from './Header';
import Search from './Search';
import HeaderMenu from './HeaderMenu';
import Conversations from './Conversations';

const Menu =({ onLogout, currentTheme, toggleTheme })=> {

    const [text,setText]= useState('');

    return(
        <Box>
            <Header 
                onLogout={onLogout}
                currentTheme={currentTheme}
                toggleTheme={toggleTheme} />
            <Search setText={setText} />
            <Conversations text={text}/>
        </Box>
    )
}

export default Menu;