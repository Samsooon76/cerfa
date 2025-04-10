import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, Typography, Box, Chip, Avatar, IconButton } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

interface DossierCardProps {
  dossier: any;
  onClick?: () => void;
}

const DossierCard: React.FC<DossierCardProps> = ({ dossier, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: dossier.id, data: { status: dossier.statut } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      sx={{ 
        mb: 2, 
        cursor: 'grab',
        '&:active': { cursor: 'grabbing' },
        borderLeft: `4px solid ${getStatusColor(dossier.statut)}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
            {dossier.alternant?.prenom} {dossier.alternant?.nom}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip 
              label={getStatusText(dossier.statut)} 
              size="small"
              sx={{ 
                backgroundColor: getStatusColor(dossier.statut),
                color: 'text.secondary',
                fontWeight: 'medium',
                mr: 1
              }}
            />
            <IconButton size="small">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {dossier.entreprise?.nom}
        </Typography>
        
        {dossier.date_debut && dossier.date_fin && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {formatDate(dossier.date_debut)} - {formatDate(dossier.date_fin)}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            ID: {dossier.id?.substring(0, 8) || 'N/A'}
          </Typography>
          
          {dossier.tuteur && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 24, 
                  height: 24, 
                  fontSize: '0.75rem',
                  bgcolor: 'primary.main',
                  mr: 1
                }}
              >
                {dossier.tuteur.prenom?.charAt(0)}{dossier.tuteur.nom?.charAt(0)}
              </Avatar>
              <Typography variant="caption">
                {dossier.tuteur.prenom} {dossier.tuteur.nom}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DossierCard;
