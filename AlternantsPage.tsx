import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Divider,
  Avatar
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { getAlternants } from '../services/supabaseClient';
import CreateAlternantModal from '../components/Alternant/CreateAlternantModal';

const AlternantsPage: React.FC = () => {
  const [alternants, setAlternants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [actionAnchorEl, setActionAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAlternantId, setSelectedAlternantId] = useState<string | null>(null);
  
  // États pour les modals
  const [openNewAlternant, setOpenNewAlternant] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Charger les alternants
        const alternantsData = await getAlternants();
        setAlternants(alternantsData || []);
        
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>, alternantId: string) => {
    setActionAnchorEl(event.currentTarget);
    setSelectedAlternantId(alternantId);
  };

  const handleMenuClose = () => {
    setFilterAnchorEl(null);
    setSortAnchorEl(null);
    setActionAnchorEl(null);
  };

  const handleCreateAlternantSuccess = async () => {
    try {
      // Recharger les alternants
      const data = await getAlternants();
      setAlternants(data || []);
      setSuccess("Alternant créé avec succès");
    } catch (err: any) {
      setError(err.message || "Erreur lors du rechargement des alternants");
    }
  };

  // Filtrer les alternants en fonction du terme de recherche
  const filteredAlternants = alternants.filter(alternant => {
    const searchLower = searchTerm.toLowerCase();
    return (
      alternant.nom?.toLowerCase().includes(searchLower) ||
      alternant.prenom?.toLowerCase().includes(searchLower) ||
      alternant.email?.toLowerCase().includes(searchLower) ||
      alternant.formation?.toLowerCase().includes(searchLower)
    );
  });

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <Layout title="Alternants">
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Alternants
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setOpenNewAlternant(true)}
            sx={{ 
              backgroundColor: 'black',
              '&:hover': {
                backgroundColor: '#333',
              }
            }}
          >
            Nouvel alternant
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <TextField
            placeholder="Rechercher un alternant..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box>
            <Button 
              startIcon={<FilterListIcon />}
              size="small"
              sx={{ mr: 1 }}
              onClick={handleFilterClick}
            >
              Filtrer
            </Button>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Tous les alternants</MenuItem>
              <Divider />
              <MenuItem onClick={handleMenuClose}>Avec dossier</MenuItem>
              <MenuItem onClick={handleMenuClose}>Sans dossier</MenuItem>
            </Menu>
            
            <Button 
              startIcon={<SortIcon />}
              size="small"
              onClick={handleSortClick}
            >
              Trier
            </Button>
            <Menu
              anchorEl={sortAnchorEl}
              open={Boolean(sortAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Nom (A-Z)</MenuItem>
              <MenuItem onClick={handleMenuClose}>Nom (Z-A)</MenuItem>
              <MenuItem onClick={handleMenuClose}>Date de création (plus récent)</MenuItem>
              <MenuItem onClick={handleMenuClose}>Date de création (plus ancien)</MenuItem>
            </Menu>
          </Box>
        </Box>

        {loading && <Typography>Chargement des alternants...</Typography>}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && filteredAlternants.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Aucun alternant trouvé
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm ? 
                "Aucun résultat ne correspond à votre recherche. Essayez d'autres termes." : 
                "Vous n'avez pas encore créé d'alternant. Commencez par en créer un nouveau."}
            </Typography>
            {!searchTerm && (
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => setOpenNewAlternant(true)}
                sx={{ 
                  backgroundColor: 'black',
                  '&:hover': {
                    backgroundColor: '#333',
                  }
                }}
              >
                Nouvel alternant
              </Button>
            )}
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Alternant</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Téléphone</TableCell>
                  <TableCell>Date de naissance</TableCell>
                  <TableCell>Formation</TableCell>
                  <TableCell>Adresse</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAlternants.map((alternant) => (
                  <TableRow key={alternant.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 1,
                            bgcolor: 'primary.main',
                            fontSize: '0.875rem'
                          }}
                        >
                          {alternant.prenom?.charAt(0)}{alternant.nom?.charAt(0)}
                        </Avatar>
                        <Typography>
                          {alternant.prenom} {alternant.nom}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{alternant.email}</TableCell>
                    <TableCell>{alternant.telephone || '-'}</TableCell>
                    <TableCell>{formatDate(alternant.date_naissance) || '-'}</TableCell>
                    <TableCell>{alternant.formation || '-'}</TableCell>
                    <TableCell>
                      {alternant.adresse ? 
                        `${alternant.adresse}, ${alternant.code_postal} ${alternant.ville}` : 
                        '-'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleActionClick(e, alternant.id)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Menu d'actions pour un alternant */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          Voir les détails
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Modifier
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>

      {/* Modal de création d'un nouvel alternant */}
      <CreateAlternantModal
        open={openNewAlternant}
        onClose={() => setOpenNewAlternant(false)}
        onSuccess={handleCreateAlternantSuccess}
      />

      {/* Snackbar pour les messages de succès */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default AlternantsPage;
