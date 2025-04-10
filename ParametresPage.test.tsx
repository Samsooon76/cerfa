import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ParametresPage from '../pages/ParametresPage';
import { AuthProvider } from '../contexts/AuthContext';

// Mock de Supabase
jest.mock('../services/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockReturnValue({ data: { session: { user: { id: '1' } } }, error: null })
    }
  }
}));

// Mock du Layout
jest.mock('../components/Layout/Layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>
}));

// Mock des composants de gestion des utilisateurs
jest.mock('../components/Auth/UserManagement', () => ({
  __esModule: true,
  default: () => <div data-testid="user-management">User Management Component</div>
}));

jest.mock('../components/Auth/UserInviteForm', () => ({
  __esModule: true,
  default: () => <div data-testid="user-invite-form">User Invite Form Component</div>
}));

describe('ParametresPage', () => {
  const renderParametresPage = () => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          <ParametresPage />
        </BrowserRouter>
      </AuthProvider>
    );
  };

  test('affiche le titre de la page', async () => {
    renderParametresPage();
    
    await waitFor(() => {
      expect(screen.getByText('Paramètres')).toBeInTheDocument();
    });
  });

  test('affiche les onglets de paramètres', async () => {
    renderParametresPage();
    
    await waitFor(() => {
      expect(screen.getByText('Utilisateurs')).toBeInTheDocument();
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Intégrations')).toBeInTheDocument();
      expect(screen.getByText('Stockage')).toBeInTheDocument();
      expect(screen.getByText('À propos')).toBeInTheDocument();
    });
  });

  test('affiche le contenu de l\'onglet Utilisateurs par défaut', async () => {
    renderParametresPage();
    
    await waitFor(() => {
      expect(screen.getByText('Gestion des utilisateurs')).toBeInTheDocument();
      expect(screen.getByTestId('user-invite-form')).toBeInTheDocument();
      expect(screen.getByTestId('user-management')).toBeInTheDocument();
    });
  });

  test('permet de changer d\'onglet', async () => {
    renderParametresPage();
    
    // Cliquer sur l'onglet À propos
    fireEvent.click(screen.getByText('À propos'));
    
    await waitFor(() => {
      expect(screen.getByText('À propos de l\'application')).toBeInTheDocument();
      expect(screen.getByText('AlterManager')).toBeInTheDocument();
      expect(screen.getByText('Version 1.0.0')).toBeInTheDocument();
    });
  });
});
