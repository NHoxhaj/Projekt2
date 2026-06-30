import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, TextField, Menu, MenuItem } from '@mui/material';

const NavBar = ({ loggedIn, user, handleLogout, setSearchTerm, cartItemCount }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleMenuClick = () => {
    navigate('/menu');
    window.scrollTo(0, 0);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleOrdersClick = () => {
    navigate('/orders');
  };

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate('/');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div>
      <AppBar id="fullNavBar" position="fixed" sx={{ backgroundColor: 'orange', height: '70px', marginBottom: '90px' }}>
        <Toolbar>
          <Typography onClick={handleMenuClick} variant="h1" id="titullNav" component="div" sx={{ flexGrow: 0.5, fontSize: '40px', cursor: 'pointer' }}>
            FooDish
          </Typography>
          {loggedIn && (
            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                id="searchBox"
                label="Kerko ushqimin..."
                variant="outlined"
                onChange={handleSearchChange}
                size="small"
              />
              {user ? (
                <Typography sx={{ fontSize: '20px' }} variant="body1">
                  Mire se vjen, {user.firstName}!
                </Typography>
              ) : (
                <Typography variant="body1">Loading...</Typography>
              )}
              <Button sx={{ fontSize: '20px' }} color="inherit" onClick={handleMenuClick}>
                Menu
              </Button>
              <Typography sx={{ fontSize: '20px' }} color="inherit" onClick={handleCartClick}>
                Karta {cartItemCount > 0 && `(${cartItemCount})`}
              </Typography>
              <Button sx={{ fontSize: '20px' }} color="inherit" onClick={handleOrdersClick}>
                Porosite
              </Button>
              <Button sx={{ fontSize: '20px' }} color="inherit" onClick={handleLogoutClick}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <AppBar id="compactNavBar" position="fixed" sx={{ backgroundColor: 'orange', height: '70px', display: 'none' }}>
        <Toolbar>
          <Typography onClick={handleMenuClick} variant="h1" id="titullNav" component="div" sx={{ flexGrow: 0.5, fontSize: '40px', cursor: 'pointer' }}>
            FooDish
          </Typography>
          {loggedIn && (
            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                id="compactSearchBox"
                label="Kerko ushqimin..."
                variant="outlined"
                onChange={handleSearchChange}
                size="small"
              />
              <Box
                onClick={toggleDropdown}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                  cursor: 'pointer',
                  width: '30px',
                }}
              >
                <div style={{ height: '4px', width: '30px', backgroundColor: 'black' }}></div>
                <div style={{ height: '4px', width: '30px', backgroundColor: 'black' }}></div>
                <div style={{ height: '4px', width: '30px', backgroundColor: 'black' }}></div>
              </Box>
              {dropdownOpen && (
                <Menu
                  open={dropdownOpen}
                  onClose={() => setDropdownOpen(false)}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  sx={{
                    position: 'absolute',
                    top: '-9%',
                    left: '10px',
                  }}
                >
                  <MenuItem onClick={handleMenuClick}>Menu</MenuItem>
                  <MenuItem onClick={handleCartClick}>Karta</MenuItem>
                  <MenuItem onClick={handleOrdersClick}>Porosite</MenuItem>
                  <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                </Menu>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <main style={{ marginTop: '100px' }}></main>
    </div>
  );
};

export default NavBar;
