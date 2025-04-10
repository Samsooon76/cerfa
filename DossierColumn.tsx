import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Paper, Typography, Box } from '@mui/material';

interface DossierColumnProps {
  title: string;
  count: number;
  status: 'REQUEST' | 'CREATED' | 'VERIFICATION' | 'PROCESSING';
  children: React.ReactNode;
}

const DossierColumn: React.FC<DossierColumnProps> = ({ title, count, status, children }) => {
  const { setNodeRef } = useDroppable({
    id: `droppable-${status}`,
    data: { status },
  });

  // Fonction pour obtenir la couleur de l'en-tête en fonction du statut
  const getHeaderColor = (status: string) => {
    switch (status) {
      case 'REQUEST':
        return '#bbdefb'; // Bleu
      case 'CREATED':
        return '#c8e6c9'; // Vert
      case 'VERIFICATION':
        return '#ffecb3'; // Jaune
      case 'PROCESSING':
        return '#e1bee7'; // Violet
      default:
        return '#e0e0e0'; // Gris
    }
  };

  return (
    <Paper 
      ref={setNodeRef}
      elevation={0} 
      sx={{ 
        height: '100%', 
        backgroundColor: '#f9f9f9',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid #eee'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          p: 2,
          backgroundColor: getHeaderColor(status),
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.7)', 
            borderRadius: '50%', 
            width: 24, 
            height: 24, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 'bold'
          }}
        >
          {count}
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {children}
      </Box>
    </Paper>
  );
};

export default DossierColumn;
