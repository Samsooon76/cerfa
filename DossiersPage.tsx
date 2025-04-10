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
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon, 
  FileUpload as FileUploadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { getDossiers, createDossier, updateDossierStatus, deleteDossier } from '../services/supabaseClient';
import { getAlternants } from '../services/supabaseClient';
import CreateDossierModal from '../components/Dossier/CreateDossierModal';
import DossierDetailModal from '../components/Dossier/DossierDetailModal';
import DeleteDossierModal from '../components/Dossier/DeleteDossierModal';
import FileUploadModal from '../components/Shared/FileUploadModal';

const DossiersPage: React.FC = () => {
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [alternants, setAlternants] = useState<any[]>([]);
  const [entreprises, setEntreprises] = useState<any[]>([]);
  const [tuteurs, setTuteurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [actionAnchorEl, setActionAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(null);
  
  // États pour les modals
  const [openNewDossier, setOpenNewDossier] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  
  // Données de test pour les sélecteurs (à remplacer par des données réelles)
  const testEntreprises = [
    { id: '1', nom: 'Entreprise A' },
    { id: '2', nom: 'Entreprise B' },
    { id: '3', nom: 'Entreprise C' }
  ];
  
  const testTuteurs = [
    { id: '1', nom: 'Leroy', prenom: 'Michel' },
    { id: '2', nom: 'Petit', prenom: 'Sophie' },
    { id: '3', nom: 'Moreau', prenom: 'Philippe' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Charger les dossiers
        const dossiersData = await getDossiers();
        setDossiers(dossiersData || []);
        
        // Charger les alternants
        const alternantsData = await getAlternants();
        setAlternants(alternantsData || []);
        
        // Pour l'instant, utiliser des données de test pour entreprises et tuteurs
        setEntreprises(testEntreprises);
        setTuteurs(testTuteurs);
        
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Vérifier si l'URL contient un paramètre pour ouvrir le modal de création
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('create') === 'true') {
      setOpenNewDossier(true);
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REQUEST':
        return '#e3f2fd'; // Bleu clair
      case 'CREATED':
        return '#e8f5e9'; // Vert clair
      case 'VERIFICATION':
        return '#fff8e1'; // Jaune clair
      case 'PROCESSING':
        return '#f3e5f5'; // Violet clair
      default:
        return '#f5f5f5'; // Gris clair
    }
  };

  // Fonction pour obtenir le texte du statut
  const getStatusText = (status: string) => {
    switch (status) {
      case 'REQUEST':
        return 'Demande';
      case 'CREATED':
        return 'Créé';
      case 'VERIFICATION':
        return 'Vérification';
      case 'PROCESSING':
        return 'En traitement';
      default:
        return status;
    }
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>, dossierId: string) => {
    setActionAnchorEl(event.currentTarget);
    setSelectedDossierId(dossierId);
  };

  const handleMenuClose = () => {
    setFilterAnchorEl(null);
    setSortAnchorEl(null);
    setActionAnchorEl(null);
  };

  const handleViewDossier = () => {
    setActionAnchorEl(null);
    const dossier = dossiers.find(d => d.id === selectedDossierId);
    if (dossier) {
      setSelectedDossierId(dossier.id);
      setOpenDetailModal(true);
    }
  };

  const handleDeleteDossier = () => {
    setActionAnchorEl(null);
    setOpenDeleteModal(true);
  };

  const confirmDeleteDossier = async () => {
    if (!selectedDossierId) return;
    
    try {
      setLoading(true);
      await deleteDossier(selectedDossierId);
      
      // Mettre à jour la liste des dossiers
      setDossiers(dossiers.filter(d => d.id !== selectedDossierId));
      
      setSuccess("Dossier supprimé avec succès");
      setOpenDeleteModal(false);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression du dossier");
    } finally {
      setLoading(false);
    }
  };

  const handleDossierUpdate = async (updatedDossier: any) => {
    try {
      // Mise à jour locale pour une UI réactive
      setDossiers(dossiers.map(d => 
        d.id === updatedDossier.id ? updatedDossier : d
      ));
      
      // Mise à jour dans la base de données
      await updateDossierStatus(updatedDossier.id, updatedDossier.statut);
      
      setSuccess("Dossier mis à jour avec succès");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du dossier");
      // Recharger les données en cas d'erreur
      const data = await getDossiers();
      setDossiers(data || []);
    }
  };

  const handleCreateDossierSuccess = async () => {
    try {
      // Recharger les dossiers
      const data = await getDossiers();
      setDossiers(data || []);
      setSuccess("Dossier créé avec succès");
    } catch (err: any) {
      setError(err.message || "Erreur lors du rechargement des dossiers");
    }
  };

  // Filtrer les dossiers en fonction du terme de recherche
  const filteredDossiers = dossiers.filter(dossier => {
    const searchLower = searchTerm.toLowerCase();
    return (
      dossier.alternant?.nom?.toLowerCase().includes(searchLower) ||
      dossier.alternant?.prenom?.toLowerCase().includes(searchLower) ||
      dossier.entreprise?.nom?.toLowerCase().includes(searchLower) ||
      dossier.id?.toLowerCase().includes(searchLower)
    );
  });

  const selectedDossier = dossiers.find(d => d.id === selectedDossierId);

  return (
    <Layout title="Dossiers">
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Dossiers
          </Typography>
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<FileUploadIcon />}
              onClick={() => setOpenImportDialog(true)}
              sx={{ mr: 2 }}
            >
              Importer un document
            </Button>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setOpenNewDossier(true)}
              sx={{ 
                backgroundColor: 'black',
                '&:hover': {
                  backgroundColor: '#333',
                }
              }}
            >
              Nouveau dossier
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <TextField
            placeholder="Rechercher un dossier..."
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
              <MenuItem onClick={handleMenuClose}>Tous les statuts</MenuItem>
              <Divider />
              <MenuItem onClick={handleMenuClose}>Demandes</MenuItem>
              <MenuItem onClick={handleMenuClose}>Créés</MenuItem>
              <MenuItem onClick={handleMenuClose}>En vérification</MenuItem>
              <MenuItem onClick={handleMenuClose}>En traitement</MenuItem>
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
              <MenuItem onClick={handleMenuClose}>Date (plus récent)</MenuItem>
              <MenuItem onClick={handleMenuClose}>Date (plus ancien)</MenuItem>
              <MenuItem onClick={handleMenuClose}>Nom de l'alternant (A-Z)</MenuItem>
              <MenuItem onClick={handleMenuClose}>Nom de l'alternant (Z-A)</MenuItem>
            </Menu>
          </Box>
        </Box>

        {loading && <Typography>Chargement des dossiers...</Typography>}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && filteredDossiers.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Aucun dossier trouvé
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm ? 
                "Aucun résultat ne correspond à votre recherche. Essayez d'autres termes." : 
                "Vous n'avez pas encore créé de dossier. Commencez par en créer un nouveau."}
            </Typography>
            {!searchTerm && (
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => setOpenNewDossier(true)}
                sx={{ 
                  backgroundColor: 'black',
                  '&:hover': {
                    backgroundColor: '#333',
                  }
                }}
              >
                Nouveau dossier
              </Button>
            )}
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Alternant</TableCell>
                  <TableCell>Entreprise</TableCell>
                  <TableCell>Tuteur</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Date de début</TableCell>
                  <TableCell>Date de fin</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDossiers.map((dossier) => (
                  <TableRow key={dossier.id}>
                    <TableCell>{dossier.id.substring(0, 8)}</TableCell>
                    <TableCell>
                      {dossier.alternant?.prenom} {dossier.alternant?.nom}
                    </TableCell>
                    <TableCell>{dossier.entreprise?.nom}</TableCell>
                    <TableCell>
                      {dossier.tuteur?.prenom} {dossier.tuteur?.nom}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusText(dossier.statut)} 
                        size="small"
                        sx={{ 
                          backgroundColor: getStatusColor(dossier.statut),
                          color: 'text.secondary',
                          fontWeight: 'medium',
                        }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(dossier.date_debut)}</TableCell>
                    <TableCell>{formatDate(dossier.date_fin)}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleActionClick(e, dossier.id)}
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

      {/* Menu d'actions pour un dossier */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDossier}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          Voir les détails
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Modifier
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteDossier} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>

      {/* Modal de création d'un nouveau dossier */}
      <CreateDossierModal
        open={openNewDossier}
        onClose={() => setOpenNewDossier(false)}
        onSuccess={handleCreateDossierSuccess}
        alternants={alternants}
        entreprises={entreprises}
        tuteurs={tuteurs}
      />

      {/* Modal de détail d'un dossier */}
      {selectedDossier && (
        <DossierDetailModal
          open={openDetailModal}
          onClose={() => setOpenDetailModal(false)}
          dossier={selectedDossier}
          onUpdate={handleDossierUpdate}
        />
      )}

      {/* Modal de suppression d'un dossier */}
      {selectedDossier && (
        <DeleteDossierModal
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={confirmDeleteDossier}
          dossier={selectedDossier}
          loading={loading}
        />
      )}

      {/* Modal d'importation de document */}
      <FileUploadModal
        open={openImportDialog}
        onClose={() => s
(Content truncated due to size limit. Use line ranges to read in chunks)