import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Layout from '../components/Layout/Layout';
import StatisticsSection from '../components/Dashboard/StatisticsSection';
import PipelineSection from '../components/Dashboard/PipelineSection';
import { getDossiers, updateDossierStatus } from '../services/supabaseClient';

const DashboardPage: React.FC = () => {
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        const data = await getDossiers();
        setDossiers(data || []);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des dossiers");
      } finally {
        setLoading(false);
      }
    };

    fetchDossiers();
  }, []);

  const handleDossierUpdate = async (updatedDossier: any) => {
    try {
      // Mise à jour locale pour une UI réactive
      setDossiers(dossiers.map(d => 
        d.id === updatedDossier.id ? updatedDossier : d
      ));
      
      // Mise à jour dans la base de données
      await updateDossierStatus(updatedDossier.id, updatedDossier.statut);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du dossier");
      // Recharger les données en cas d'erreur
      const data = await getDossiers();
      setDossiers(data || []);
    }
  };

  const handleCreateDossier = () => {
    // Rediriger vers la page des dossiers avec le modal de création ouvert
    window.location.href = '/dossiers?create=true';
  };

  return (
    <Layout title="Tableau de bord">
      <Box sx={{ flexGrow: 1 }}>
        {/* Section des statistiques */}
        <StatisticsSection />
        
        {/* Section du pipeline */}
        <PipelineSection 
          dossiers={dossiers}
          onDossierUpdate={handleDossierUpdate}
          onCreateDossier={handleCreateDossier}
        />
      </Box>
    </Layout>
  );
};

export default DashboardPage;
