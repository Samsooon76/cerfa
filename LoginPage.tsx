import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Link, 
  Alert,
  Snackbar
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  
  const { signIn, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      await signInWithGoogle();
      // La redirection est gérée par Supabase OAuth
    } catch (err: any) {
      setError(err.message || "Erreur lors de la connexion avec Google");
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      setError("Veuillez entrer votre adresse email");
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      await resetPassword(resetEmail);
      setResetEmailSent(true);
      setShowResetForm(false);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la réinitialisation du mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Connexion
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          {!showResetForm ? (
            <Box component="form" onSubmit={handleLogin} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Nom d'utilisateur"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ 
                  mt: 1, 
                  mb: 2, 
                  py: 1.5, 
                  backgroundColor: 'black',
                  '&:hover': {
                    backgroundColor: '#333',
                  }
                }}
              >
                Se connecter
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                disabled={loading}
                sx={{ 
                  mb: 2, 
                  py: 1.5,
                  borderColor: '#ddd',
                  color: '#333',
                  '&:hover': {
                    borderColor: '#aaa',
                    backgroundColor: '#f5f5f5',
                  }
                }}
              >
                Se connecter avec Google
              </Button>
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link 
                  href="#" 
                  variant="body2" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowResetForm(true);
                  }}
                  sx={{ display: 'block', mb: 1 }}
                >
                  Mot de passe oublié ?
                </Link>
                <Link 
                  href="/register" 
                  variant="body2"
                >
                  Pas encore de compte ? Créer un compte
                </Link>
              </Box>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleResetPassword} noValidate>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Entrez votre adresse email pour réinitialiser votre mot de passe.
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="reset-email"
                label="Adresse email"
                name="email"
                autoComplete="email"
                autoFocus
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                sx={{ mb: 3 }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ 
                  mt: 1, 
                  mb: 2, 
                  py: 1.5, 
                  backgroundColor: 'black',
                  '&:hover': {
                    backgroundColor: '#333',
                  }
                }}
              >
                Réinitialiser le mot de passe
              </Button>
              
              <Button
                fullWidth
                variant="text"
                onClick={() => setShowResetForm(false)}
                sx={{ mb: 2 }}
              >
                Retour à la connexion
              </Button>
            </Box>
          )}
        </Paper>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        
        <Snackbar
          open={resetEmailSent}
          autoHideDuration={6000}
          onClose={() => setResetEmailSent(false)}
          message="Un email de réinitialisation a été envoyé à votre adresse email."
        />
      </Box>
    </Container>
  );
};

export default LoginPage;
