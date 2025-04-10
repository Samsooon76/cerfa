import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Alert,
  Box,
  Snackbar
} from '@mui/material';
import { CameraAlt as CameraIcon } from '@mui/icons-material';
import { createAlternant } from '../../services/supabaseClient';
import OCRScanModal from '../Auth/OCRScanModal';
import { IDCardData } from '../../utils/mistralAI';

interface CreateAlternantModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateAlternantModal: React.FC<CreateAlternantModalProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    date_naissance: '',
    adresse: '',
    code_postal: '',
    ville: '',
    formation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [openOCRModal, setOpenOCRModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    // Validation de base
    if (!formData.nom || !formData.prenom || !formData.email) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await createAlternant(formData);
      
      setSuccess(true);
      
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        date_naissance: '',
        adresse: '',
        code_postal: '',
        ville: '',
        formation: ''
      });
      
      // Fermer le modal après un court délai
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de l'alternant");
    } finally {
      setLoading(false);
    }
  };

  const handleOCRData = (data: IDCardData) => {
    setFormData({
      ...formData,
      nom: data.nom || formData.nom,
      prenom: data.prenom || formData.prenom,
      date_naissance: data.date_naissance || formData.date_naissance,
      adresse: data.adresse || formData.adresse,
      code_postal: data.code_postal || formData.code_postal,
      ville: data.ville || formData.ville
    });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nouvel alternant</Typography>
            <Button 
              variant="outlined" 
              startIcon={<CameraIcon />}
              onClick={() => setOpenOCRModal(true)}
              disabled={loading}
            >
              Scanner une carte d'identité
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '1 / span 6' } }}>
              <TextField
                fullWidth
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
              />
            </Grid>
            <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '7 / span 6' } }}>
              <TextField
                fullWidth
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
              />
            </Grid>
            <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '1 / span 6' } }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
              />
            </Grid>
            <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '7 / span 6' } }}>
              <TextField
                fullWidth
                label="Téléphone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                margin="normal"
                disabled={loading}
              />
            </Grid>
            <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '1 / span 6' } }}>
              <TextField
                fullWidth
                label="Date de naissance"
                name="date_naissance"
                type="date"
                value={formData.date_naissance}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                disabled={loading}
              />
            </Grid>
            <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '7 / span 6' } }}>
              <TextField
                fullWidth
                label="Formation"
                name="formation"
                value={formData.formation}
                onChange={handleInputChange}
                margin="normal"
                disabled={loading}
              />
            </Grid>
            <Grid sx={{ gridColumn: '1 / span 12' }}>
              <TextField
                fullWidth
                label="Adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                margin="normal"
                disabled={loading}
              />
            </Grid>
            <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '1 / span 6' } }}>
              <TextField
                fullWidth
                label="Code postal"
                name="code_postal"
                value={formData.code_postal}
                onChange={handleInputChange}
                margin="normal"
                disabled={loading}
              />
            </Grid>
            <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '7 / span 6' } }}>
              <TextField
                fullWidth
                label="Ville"
                name="ville"
                value={formData.ville}
                onChange={handleInputChange}
                margin="normal"
                disabled={loading}
              />
            </Grid>
          </Grid>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} disabled={loading}>Annuler</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading}
            sx={{ 
              backgroundColor: 'black',
              '&:hover': {
                backgroundColor: '#333',
              }
            }}
          >
            {loading ? 'Création en cours...' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <OCRScanModal
        open={openOCRModal}
        onClose={() => setOpenOCRModal(false)}
        onDataExtracted={handleOCRData}
      />
      
      <Snackbar 
        open={success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Alternant créé avec succès !
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateAlternantModal;
