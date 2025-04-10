import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Paper,
  Button,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsSection: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Données pour le graphique d'évolution des dossiers
  const chartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Dossiers créés',
        data: [5, 8, 12, 9, 15, 20],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Dossiers validés',
        data: [3, 5, 8, 7, 12, 15],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Évolution des dossiers',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Statistiques
        </Typography>
        <Box>
          <Button 
            startIcon={<FilterListIcon />}
            size="small"
            sx={{ mr: 1 }}
          >
            Filtrer
          </Button>
          <Button 
            startIcon={<SortIcon />}
            size="small"
            onClick={handleClick}
          >
            Période
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Aujourd'hui</MenuItem>
            <MenuItem onClick={handleClose}>Cette semaine</MenuItem>
            <MenuItem onClick={handleClose}>Ce mois</MenuItem>
            <MenuItem onClick={handleClose}>Cette année</MenuItem>
          </Menu>
        </Box>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid sx={{ gridColumn: { xs: '1 / span 12', sm: '1 / span 6', md: '1 / span 3' } }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Total dossiers
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              42
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                +5%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                depuis le mois dernier
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid sx={{ gridColumn: { xs: '1 / span 12', sm: '7 / span 6', md: '4 / span 3' } }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Dossiers en vérification
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              12
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="body2" color="error.main" sx={{ display: 'flex', alignItems: 'center' }}>
                -2%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                depuis le mois dernier
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid sx={{ gridColumn: { xs: '1 / span 12', sm: '1 / span 6', md: '7 / span 3' } }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Dossiers validés
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              25
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                +10%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                depuis le mois dernier
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid sx={{ gridColumn: { xs: '1 / span 12', sm: '7 / span 6', md: '10 / span 3' } }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Temps moyen de traitement
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              3.5 jours
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Stable depuis le mois dernier
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        <Line options={chartOptions} data={chartData} height={80} />
      </Paper>
    </Box>
  );
};

export default StatisticsSection;
