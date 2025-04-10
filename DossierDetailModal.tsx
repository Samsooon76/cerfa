import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  TextField, 
  Grid,
  Chip,
  Divider,
  Avatar
} from '@mui/material';
import { 
  Person as PersonIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Comment as CommentIcon
} from '@mui/icons-material';

interface DossierDetailModalProps {
  open: boolean;
  onClose: () => void;
  dossier: any;
  onUpdate?: (dossier: any) => void;
}

const DossierDetailModal: React.FC<DossierDetailModalProps> = ({ 
  open, 
  onClose, 
  dossier,
  onUpdate 
}) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    commentaires: dossier?.commentaires || '',
    statut: dossier?.statut || 'REQUEST'
  });

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
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleStatusChange = (status: 'REQUEST' | 'CREATED' | 'VERIFICATION' | 'PROCESSING') => {
    setFormData({
      ...formData,
      statut: status
    });
  };

  const handleSave = () => {
    if (onUpdate && dossier) {
      onUpdate({
        ...dossier,
        ...formData
      });
    }
    setEditMode(false);
  };

  if (!dossier) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Détails du dossier
        </Typography>
        <Chip 
          label={getStatusText(dossier.statut)} 
          sx={{ 
            backgroundColor: getStatusColor(dossier.statut),
            color: 'text.secondary',
            fontWeight: 'medium',
          }}
        />
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Informations sur l'alternant */}
            <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '1 / span 4' } }}>
              <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                    <PersonIcon />
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Alternant
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                  {dossier.alternant?.prenom} {dossier.alternant?.nom}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {dossier.alternant?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {dossier.alternant?.telephone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dossier.alternant?.adresse}, {dossier.alternant?.code_postal} {dossier.alternant?.ville}
                </Typography>
              </Box>
            </Grid>
            
            {/* Informations sur l'entreprise */}
            <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '5 / span 4' } }}>
              <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 1 }}>
                    <BusinessIcon />
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Entreprise
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                  {dossier.entreprise?.nom}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  SIRET: {dossier.entreprise?.siret || 'Non renseigné'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {dossier.entreprise?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dossier.entreprise?.adresse}, {dossier.entreprise?.code_postal} {dossier.entreprise?.ville}
                </Typography>
              </Box>
            </Grid>
            
            {/* Informations sur le tuteur */}
            <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '9 / span 4' } }}>
              <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'info.main', mr: 1 }}>
                    <SchoolIcon />
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Tuteur
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                  {dossier.tuteur?.prenom} {dossier.tuteur?.nom}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {dossier.tuteur?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dossier.tuteur?.telephone}
                </Typography>
              </Box>
            </Grid>
            
            {/* Dates et statut */}
            <Grid sx={{ gridColumn: '1 / span 12' }}>
              <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Informations du dossier
                </Typography>
                <Grid container spacing={2}>
                  <Grid sx={{ gridColumn: { xs: '1 / span 12', sm: '1 / span 4' } }}>
                    <Typography variant="body2" color="text.secondary">
                      Date de début
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(dossier.date_debut)}
                    </Typography>
                  </Grid>
                  <Grid sx={{ gridColumn: { xs: '1 / span 12', sm: '5 / span 4' } }}>
                    <Typography variant="body2" color="text.secondary">
                      Date de fin
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(dossier.date_fin)}
                    </Typography>
                  </Grid>
                  <Grid sx={{ gridColumn: { xs: '1 / span 12', sm: '9 / span 4' } }}>
                    <Typography variant="body2" color="text.secondary">
                      Statut
                    </Typography>
                    {editMode ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {['REQUEST', 'CREATED', 'VERIFICATION', 'PROCESSING'].map((status) => (
                          <Chip 
                            key={status}
                            label={getStatusText(status)}
                            onClick={() => handleStatusChange(status as any)}
                            sx={{ 
                              backgroundColor: getStatusColor(status),
                              color: 'text.secondary',
                              fontWeight: 'medium',
                              border: formData.statut === status ? '2px solid #666' : 'none'
                            }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body1">
                        {getStatusText(dossier.statut)}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            
            {/* Commentaires */}
            <Grid sx={{ gridColumn: '1 / span 12' }}>
              <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 1 }}>
                    <CommentIcon />
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Commentaires
                  </Typography>
                </Box>
                {editMode ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="commentaires"
                    value={formData.commentaires}
                    onChange={handleInputChange}
                    placeholder="Ajouter des commentaires sur ce dossier..."
                  />
                ) : (
                  <Typography variant="body2">
                    {dossier.commentaires || 'Aucun commentaire'}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        {editMode ? (
          <>
            <Button onClick={() => setEditMode(false)}>Annuler</Button>
            <Button 
              onClick={handleSave}
              variant="contained"
              sx={{ 
                backgroundColor: 'black',
                '&:hover': {
                  backgroundColor: '#333',
                }
              }}
            >
              Enregistrer
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onClose}>Fermer</Button>
            <Button 
              onClick={() => setEditMode(true)}
              variant="contained"
              sx={{ 
                backgroundColor: 'black',
                '&:hover': {
                  backgroundColor: '#333',
                }
              }}
            >
              Modifier
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DossierDetailModal;
