import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { createDossier } from '../../services/supabaseClient';

interface CreateDossierModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  alternants: any[];
  entreprises: any[];
  tuteurs: any[];
}

const CreateDossierModal: React.FC<CreateDossierModalProps> = ({ 
  open, 
  onClose, 
  onSuccess,
  alternants = [],
  entreprises = [],
  tuteurs = []
}) => {
  const [formData, setFormData] = useState({
    alternant_id: '',
    entreprise_id: '',
    tuteur_id: '',
    date_debut: '',
    date_fin: '',
    commentaires: '',
    statut: 'REQUEST' as 'REQUEST' | 'CREATED' | 'VERIFICATION' | 'PROCESSING'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    // Validation de base
    if (!formData.alternant_id || !formData.entreprise_id || !formData.tuteur_id || !formData.date_debut || !formData.date_fin) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await createDossier(formData);
      
      setSuccess(true);
      
      // Réinitialiser le formulaire
      setFormData({
        alternant_id: '',
        entreprise_id: '',
        tuteur_id: '',
        date_debut: '',
        date_fin: '',
        commentaires: '',
        statut: 'REQUEST'
      });
      
      // Fermer le modal après un court délai
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du dossier");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Nouveau dossier</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '1 / span 4' } }}>
              <TextField
                select
                fullWidth
                label="Alternant"
                name="alternant_id"
                value={formData.alternant_id}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
              >
                {alternants.map((alternant) => (
                  <MenuItem key={alternant.id} value={alternant.id}>
                    {alternant.prenom} {alternant.nom}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '5 / span 4' } }}>
              <TextField
                select
                fullWidth
                label="Entreprise"
                name="entreprise_id"
                value={formData.entreprise_id}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
              >
                {entreprises.map((entreprise) => (
                  <MenuItem key={entreprise.id} value={entreprise.id}>
                    {entreprise.nom}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '9 / span 4' } }}>
              <TextField
                select
                fullWidth
                label="Tuteur"
                name="tuteur_id"
                value={formData.tuteur_id}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
              >
                {tuteurs.map((tuteur) => (
                  <MenuItem key={tuteur.id} value={tuteur.id}>
                    {tuteur.prenom} {tuteur.nom}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '1 / span 6' } }}>
              <TextField
                fullWidth
                label="Date de début"
                name="date_debut"
                type="date"
                value={formData.date_debut}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '7 / span 6' } }}>
              <TextField
                fullWidth
                label="Date de fin"
                name="date_fin"
                type="date"
                value={formData.date_fin}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid sx={{ gridColumn: '1 / span 12' }}>
              <TextField
                fullWidth
                label="Commentaires"
                name="commentaires"
                multiline
                rows={4}
                value={formData.commentaires}
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
      
      <Snackbar 
        open={success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Dossier créé avec succès !
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateDossierModal;
