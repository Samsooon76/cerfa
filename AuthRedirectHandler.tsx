import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Alert, 
  Snackbar 
} from '@mui/material';
import { supabase } from '../../services/supabaseClient';

interface AuthRedirectHandlerProps {
  children: React.ReactNode;
}

const AuthRedirectHandler: React.FC<AuthRedirectHandlerProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Gestion des redirections OAuth
    const handleAuthRedirect = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      // Vérifier si nous avons un hash dans l'URL (signe d'une redirection OAuth)
      if (window.location.hash && !data.session) {
        const { data: authData, error } = await supabase.auth.getSession();
        if (error) {
          setError(`Erreur d'authentification: ${error.message}`);
        } else if (authData.session) {
          setMessage('Connexion réussie!');
          navigate('/dashboard');
        }
      }
    };

    handleAuthRedirect();

    // Vérifier si nous avons un message dans l'état de location (ex: après inscription)
    if (location.state && location.state.message) {
      setMessage(location.state.message);
      // Nettoyer l'état pour éviter d'afficher le message à nouveau lors des navigations futures
      navigate(location.pathname, { replace: true });
    }
  }, [navigate, location]);

  return (
    <>
      {children}
      
      <Snackbar 
        open={!!message} 
        autoHideDuration={6000} 
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setMessage(null)} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AuthRedirectHandler;
