import React, { useState } from 'react';
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
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

interface DeleteDossierModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dossier: any;
  loading?: boolean;
}

const DeleteDossierModal: React.FC<DeleteDossierModalProps> = ({ 
  open, 
  onClose, 
  onConfirm,
  dossier,
  loading = false
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    if (confirmText !== 'SUPPRIMER') {
      setError("Veuillez saisir 'SUPPRIMER' pour confirmer la suppression");
      return;
    }
    
    onConfirm();
  };

  if (!dossier) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
        Supprimer le dossier
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <IconButton 
            sx={{ 
              backgroundColor: 'error.light', 
              color: 'error.main', 
              p: 2,
              mb: 2
            }}
          >
            <DeleteIcon fontSize="large" />
          </IconButton>
          
          <Typography variant="h6" sx={{ mb: 2 }}>
            Êtes-vous sûr de vouloir supprimer ce dossier ?
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            Cette action est irréversible. Toutes les données associées à ce dossier seront définitivement supprimées.
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Informations du dossier :
            </Typography>
            <Typography variant="body2">
              Alternant : {dossier.alternant?.prenom} {dossier.alternant?.nom}
            </Typography>
            <Typography variant="body2">
              Entreprise : {dossier.entreprise?.nom}
            </Typography>
            <Typography variant="body2">
              ID : {dossier.id}
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            label="Saisissez 'SUPPRIMER' pour confirmer"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            variant="outlined"
            sx={{ mt: 2 }}
            error={!!error}
            helperText={error}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={loading}>Annuler</Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained"
          color="error"
          disabled={loading || confirmText !== 'SUPPRIMER'}
        >
          {loading ? 'Suppression en cours...' : 'Supprimer définitivement'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDossierModal;
