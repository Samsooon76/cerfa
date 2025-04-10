import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Box, 
  Typography, 
  Avatar 
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  Folder as FolderIcon, 
  Description as DescriptionIcon, 
  Person as PersonIcon, 
  School as SchoolIcon, 
  Assessment as AssessmentIcon, 
  Settings as SettingsIcon, 
  Logout as LogoutIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Dossiers', icon: <FolderIcon />, path: '/dossiers' },
    { text: 'Documents', icon: <DescriptionIcon />, path: '/documents' },
    { text: 'Alternants', icon: <PersonIcon />, path: '/alternants' },
    { text: 'Rentrées', icon: <SchoolIcon />, path: '/rentrees' },
    { text: 'Rapports', icon: <AssessmentIcon />, path: '/rapports' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 3 }}>
          AlterManager
          <Typography variant="subtitle2" color="text.secondary">
            Gestion des alternants
          </Typography>
        </Typography>

        <List>
          {menuItems.map((item) => (
            <ListItem 
              component="button"
              key={item.text} 
              onClick={() => handleNavigation(item.path)}
              sx={{ borderRadius: 1, mb: 0.5, border: 'none', background: 'transparent', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ my: 2 }} />
          <ListItem 
            component="button"
            onClick={() => handleNavigation('/parametres')}
            sx={{ borderRadius: 1, mb: 0.5, border: 'none', background: 'transparent', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Paramètres" />
          </ListItem>
          <ListItem 
            component="button"
            onClick={handleLogout}
            sx={{ borderRadius: 1, mb: 0.5, border: 'none', background: 'transparent', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Déconnexion" />
          </ListItem>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Avatar sx={{ mr: 2 }}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {user?.email?.split('@')[0] || 'Utilisateur'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Administrateur
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
