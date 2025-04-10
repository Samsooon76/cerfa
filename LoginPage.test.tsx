import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { AuthProvider } from '../contexts/AuthContext';

// Mock de Supabase
jest.mock('../services/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn()
    }
  }
}));

describe('LoginPage', () => {
  const renderLoginPage = () => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    );
  };

  test('affiche le formulaire de connexion', () => {
    renderLoginPage();
    
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
  });

  test('permet de basculer vers le formulaire d\'inscription', () => {
    renderLoginPage();
    
    fireEvent.click(screen.getByText('Créer un compte'));
    
    expect(screen.getByText('Inscription')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmer le mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'S\'inscrire' })).toBeInTheDocument();
  });

  test('affiche une erreur si les champs sont vides', async () => {
    renderLoginPage();
    
    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));
    
    await waitFor(() => {
      expect(screen.getByText('Veuillez remplir tous les champs')).toBeInTheDocument();
    });
  });
});
