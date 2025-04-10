import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Add as AddIcon
} from '@mui/icons-material';
import DossierColumn from '../Dossier/DossierColumn';
import DossierCard from '../Dossier/DossierCard';
import DossierDetailModal from '../Dossier/DossierDetailModal';

interface PipelineSectionProps {
  dossiers: any[];
  onDossierUpdate?: (dossier: any) => void;
  onCreateDossier?: () => void;
}

const PipelineSection: React.FC<PipelineSectionProps> = ({ 
  dossiers = [], 
  onDossierUpdate,
  onCreateDossier
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDossier, setSelectedDossier] = useState<any | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  const sortMenuOpen = Boolean(anchorEl);
  const filterMenuOpen = Boolean(filterAnchorEl);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setFilterAnchorEl(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Trouver le dossier correspondant à l'ID
      const dossier = dossiers.find(d => d.id === active.id);
      
      if (dossier && over.data.current) {
        // Extraire le nouveau statut de l'élément cible
        const newStatus = over.data.current.status;
        
        // Mettre à jour le dossier avec le nouveau statut
        const updatedDossier = {
          ...dossier,
          statut: newStatus
        };
        
        // Appeler la fonction de mise à jour
        if (onDossierUpdate) {
          onDossierUpdate(updatedDossier);
        }
      }
    }
  };

  const handleDossierClick = (dossier: any) => {
    setSelectedDossier(dossier);
    setDetailModalOpen(true);
  };

  const handleDossierUpdate = (updatedDossier: any) => {
    if (onDossierUpdate) {
      onDossierUpdate(updatedDossier);
    }
    setDetailModalOpen(false);
  };

  // Filtrer les dossiers par statut
  const requestDossiers = dossiers.filter(d => d.statut === 'REQUEST');
  const createdDossiers = dossiers.filter(d => d.statut === 'CREATED');
  const verificationDossiers = dossiers.filter(d => d.statut === 'VERIFICATION');
  const processingDossiers = dossiers.filter(d => d.statut === 'PROCESSING');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Pipeline des dossiers
        </Typography>
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
            open={filterMenuOpen}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Tous les dossiers</MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose}>Mes dossiers</MenuItem>
            <MenuItem onClick={handleMenuClose}>Dossiers non assignés</MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose}>Créés cette semaine</MenuItem>
            <MenuItem onClick={handleMenuClose}>Créés ce mois</MenuItem>
          </Menu>
          
          <Button 
            startIcon={<SortIcon />}
            size="small"
            sx={{ mr: 1 }}
            onClick={handleSortClick}
          >
            Trier
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={sortMenuOpen}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Date (plus récent)</MenuItem>
            <MenuItem onClick={handleMenuClose}>Date (plus ancien)</MenuItem>
            <MenuItem onClick={handleMenuClose}>Nom de l'alternant (A-Z)</MenuItem>
            <MenuItem onClick={handleMenuClose}>Nom de l'alternant (Z-A)</MenuItem>
          </Menu>
          
          <Button 
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            onClick={onCreateDossier}
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
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, height: 'calc(100vh - 350px)' }}>
          <DossierColumn 
            title="Demandes" 
            count={requestDossiers.length}
            status="REQUEST"
          >
            {requestDossiers.map(dossier => (
              <DossierCard 
                key={dossier.id} 
                dossier={dossier} 
                onClick={() => handleDossierClick(dossier)}
              />
            ))}
          </DossierColumn>
          
          <DossierColumn 
            title="Créés" 
            count={createdDossiers.length}
            status="CREATED"
          >
            {createdDossiers.map(dossier => (
              <DossierCard 
                key={dossier.id} 
                dossier={dossier} 
                onClick={() => handleDossierClick(dossier)}
              />
            ))}
          </DossierColumn>
          
          <DossierColumn 
            title="En vérification" 
            count={verificationDossiers.length}
            status="VERIFICATION"
          >
            {verificationDossiers.map(dossier => (
              <DossierCard 
                key={dossier.id} 
                dossier={dossier} 
                onClick={() => handleDossierClick(dossier)}
              />
            ))}
          </DossierColumn>
          
          <DossierColumn 
            title="En traitement" 
            count={processingDossiers.length}
            status="PROCESSING"
          >
            {processingDossiers.map(dossier => (
              <DossierCard 
                key={dossier.id} 
                dossier={dossier} 
                onClick={() => handleDossierClick(dossier)}
              />
            ))}
          </DossierColumn>
        </Box>
      </DndContext>
      
      {selectedDossier && (
        <DossierDetailModal 
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          dossier={selectedDossier}
          onUpdate={handleDossierUpdate}
        />
      )}
    </Box>
  );
};

export default PipelineSection;
