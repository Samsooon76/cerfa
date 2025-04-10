import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Alert,
  Grid
} from '@mui/material';
import { supabase } from '../../services/supabaseClient';

interface UserInviteFormProps {
  onSuccess?: () => void;
}

const UserInviteForm: React.FC<UserInviteFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Veuillez entrer une adresse email");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Dans une implémentation réelle, cela utiliserait l'API Supabase pour inviter un utilisateur
      // Pour l'instant, nous simulons une invitation réussie
      
      // Simulation d'un appel à l'API Supabase
      // const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
      //   data: { role }
      // });
      // if (error) throw error;
      
      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`Invitation envoyée à ${email}`);
      setEmail('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi de l'invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleInviteUser} sx={{ mb: 4 }}>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
        Inviter un nouvel utilisateur
      </Typography>
      
      <Grid container spacing={2}>
        <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '1 / span 6' } }}>
          <TextField
            fullWidth
            label="Email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </Grid>
        <Grid sx={{ gridColumn: { xs: '1 / span 12', md: '7 / span 6' } }}>
          <TextField
            select
            fullWidth
            label="Rôle"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
          >
            <MenuItem value="user">Utilisateur standard</MenuItem>
            <MenuItem value="admin">Administrateur</MenuItem>
          </TextField>
        </Grid>
      </Grid>
      
      <Button 
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{ 
          mt: 2,
          backgroundColor: 'black',
          '&:hover': {
            backgroundColor: '#333',
          }
        }}
      >
        {loading ? 'Envoi en cours...' : 'Inviter'}
      </Button>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default UserInviteForm;
