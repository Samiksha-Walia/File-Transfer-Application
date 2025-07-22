
import {Search as SearchIcon} from '@mui/icons-material';
import {Box, styled,InputBase, useTheme } from '@mui/material';

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
            </Wrapper>
        </Component>
    );
}

export default Search;