import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import { styled } from '@mui/system';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#2196F3', // Change to your preferred background color
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

function Nav() {
  return (
    <div>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Nammakadai
          </Typography>
          <div style={{ flexGrow: 1 }} />
          {/* Link to the "Categories" page */}
          <Button color="inherit" component={Link} to="/">
            Categories
          </Button>
          {/* Link to the "Cart" page */}
          <StyledIconButton color="inherit" component={Link} to="/cart">
            <ShoppingCartIcon />
          </StyledIconButton>
        </Toolbar>
      </StyledAppBar>
    </div>
  );
}

export default Nav;
