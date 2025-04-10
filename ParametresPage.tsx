import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Paper,
  Divider
} from '@mui/material';
import Layout from '../components/Layout/Layout';
import UserManagement from '../components/Auth/UserManagement';
import UserInviteForm from '../components/Auth/UserInviteForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
};

const ParametresPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([
    { id: '1', email: 'admin@example.com', role: 'admin', created_at: '2023-01-01T00:00:00Z' },
    { id: '2', email: 'user1@example.com', role: 'user', created_at: '2023-01-02T00:00:00Z' },
    { id: '3', email: 'user2@example.com', role: 'user', created_at: '2023-01-03T00:00:00Z' }
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleUserUpdated = () => {
    // Dans une implémentation réelle, cela rechargerait les utilisateurs depuis Supabase
    console.log('User updated');
  };

  return (
    <Layout title="Paramètres">
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
          Paramètres
        </Typography>
        
        <Paper sx={{ borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="settings tabs"
              sx={{ 
                '& .MuiTab-root': { 
                  fontWeight: 'medium',
                  py: 2
                }
              }}
            >
              <Tab label="Utilisateurs" {...a11yProps(0)} />
              <Tab label="Notifications" {...a11yProps(1)} />
              <Tab label="Intégrations" {...a11yProps(2)} />
              <Tab label="Stockage" {...a11yProps(3)} />
              <Tab label="À propos" {...a11yProps(4)} />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Gestion des utilisateurs
            </Typography>
            
            <UserInviteForm onSuccess={handleUserUpdated} />
            
            <Divider sx={{ my: 3 }} />
            
            <UserManagement users={users} onUserUpdated={handleUserUpdated} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Paramètres de notifications
            </Typography>
            
            <Typography variant="body1" color="text.secondary">
              Cette fonctionnalité sera disponible dans une prochaine mise à jour.
            </Typography>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Intégrations
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Mistral AI
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Intégration pour l'OCR des cartes d'identité et l'analyse de documents.
              </Typography>
              <Typography variant="body2">
                Statut: <span style={{ color: 'green', fontWeight: 'bold' }}>Connecté</span>
              </Typography>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Supabase
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Base de données, authentification et stockage de fichiers.
              </Typography>
              <Typography variant="body2">
                Statut: <span style={{ color: 'green', fontWeight: 'bold' }}>Connecté</span>
              </Typography>
            </Box>
          </TabPanel>
          
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Stockage de fichiers
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Utilisation du stockage
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Espace utilisé: 12.5 MB / 500 MB
              </Typography>
              <Box 
                sx={{ 
                  height: 8, 
                  width: '100%', 
                  backgroundColor: '#f0f0f0', 
                  borderRadius: 4,
                  overflow: 'hidden'
                }}
              >
                <Box 
                  sx={{ 
                    height: '100%', 
                    width: '2.5%', 
                    backgroundColor: 'primary.main',
                    borderRadius: 4
                  }}
                />
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Types de fichiers autorisés
              </Typography>
              <Typography variant="body2" color="text.secondary">
                PDF, DOCX, JPG, PNG (max 5MB par fichier)
              </Typography>
            </Box>
          </TabPanel>
          
          <TabPanel value={tabValue} index={4}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              À propos de l'application
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                AlterManager
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Version 1.0.0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Application de gestion des dossiers d'alternance développée avec React, TypeScript, Material UI et Supabase.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Technologies utilisées
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • React 19 avec TypeScript<br />
                • Material UI pour l'interface utilisateur<br />
                • Supabase pour la base de données et l'authentification<br />
                • Mistral AI pour l'OCR et l'analyse de documents<br />
                • DnD Kit pour le drag-and-drop<br />
                • Chart.js pour les graphiques et statistiques
              </Typography>
            </Box>
          </TabPanel>
        </Paper>
      </Box>
    </Layout>
  );
};

export default ParametresPage;
