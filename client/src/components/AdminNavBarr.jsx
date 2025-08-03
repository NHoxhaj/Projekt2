import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import { Home, AttachMoney, Group, Logout, PieChart } from '@mui/icons-material';

const AdminNavBar = ({ handleAdminLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogoutClick = async () => {
    await handleAdminLogout();
    navigate('/AdminAuth');
  };

  const isActive = (path) => location.pathname === path;

  return ( 
    <Box
className="sidebar"
  >
      <Typography variant="h3" sx={{ fontSize: '24px',fontWeight:"bold", marginBottom: '40px', color: 'white', textAlign: 'center' }}>
       Admin Dashboard
      </Typography>

      <List sx={{ flexGrow: 1 }}>
        <ListItem
          button
          onClick={() => handleNavigation('/admin/orders')}
          sx={{
            backgroundColor: isActive('/admin/orders') ? '#2e4dd6' : 'transparent',
            '&:hover': { backgroundColor: '#2e4dd6' },
          }}
        >
          <ListItemIcon>
            <Home sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Porositë" />
        </ListItem>
        <ListItem
          button
          onClick={() => handleNavigation('/admin/users')}
          sx={{
            backgroundColor: isActive('/admin/users') ? '#2e4dd6' : 'transparent',
            '&:hover': { backgroundColor: '#2e4dd6' },
          }}
        >
          <ListItemIcon>
            <Group sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Klientët" />
        </ListItem>

        <ListItem
          button
          onClick={() => handleNavigation('/admin/earnings')}
          sx={{
            backgroundColor: isActive('/admin/earnings') ? '#2e4dd6' : 'transparent',
            '&:hover': { backgroundColor: '#2e4dd6' },
          }}
        >
          <ListItemIcon>
            <AttachMoney sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Shitjet" />
        </ListItem>




        <ListItem
          button
          onClick={() => handleNavigation('/admin/stat')}
          sx={{
            backgroundColor: isActive('/admin/stat') ? '#2e4dd6' : 'transparent',
            '&:hover': { backgroundColor: '#2e4dd6' },
          }}
        >
          <ListItemIcon>
          <PieChart sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Statistika" />
        </ListItem>
        


 
      </List>

      <ListItem
        button
        onClick={handleAdminLogout}
        sx={{
          backgroundColor: isActive('/AdminAuth') ? '#2e4dd6' : 'transparent',
          '&:hover': { backgroundColor: '#2e4dd6' },
          marginTop: 'auto',
        }}
      >
        <ListItemIcon>
          <Logout sx={{ color: 'white' }} />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </Box>
  );
};

export default AdminNavBar;
