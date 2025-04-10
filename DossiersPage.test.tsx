import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DossiersPage from '../pages/DossiersPage';
import { AuthProvider } from '../contexts/AuthContext';

// Mock de Supabase
jest.mock('../services/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockReturnValue({ data: { session: { user: { id: '1' } } }, error: null })
    }
  },
  getDossiers: jest.fn().mockResolvedValue([
    {
      id: '1',
      statut: 'REQUEST',
      date_debut: '2023-01-01',
      date_fin: '2023-12-31',
      alternant: { nom: 'Dupont', prenom: 'Jean' },
      entreprise: { nom: 'Entreprise A' },
      tuteur: { nom: 'Martin', prenom: 'Sophie' }
    },
    {
      id: '2',
      statut: 'CREATED',
      date_debut: '2023-02-01',
      date_fin: '2024-01-31',
      alternant: { nom: 'Durand', prenom: 'Marie' },
      entreprise: { nom: 'Entreprise B' },
      tuteur: { nom: 'Petit', prenom: 'Thomas' }
    }
  ]),
  getAlternants: jest.fn().mockResolvedValue([]),
  updateDossierStatus: jest.fn().mockResolvedValue(true),
  deleteDossier: jest.fn().mockResolvedValue(true)
}));

// Mock du Layout
jest.mock('../components/Layout/Layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>
}));

describe('DossiersPage', () => {
  const renderDossiersPage = () => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          <DossiersPage />
        </BrowserRouter>
      </AuthProvider>
    );
  };

  test('affiche le titre de la page', async () => {
    renderDossiersPage();
    
    await waitFor(() => {
      expect(screen.getByText('Dossiers')).toBeInTheDocument();
    });
  });

  test('affiche le bouton de création de dossier', async () => {
    renderDossiersPage();
    
    await waitFor(() => {
      expect(screen.getByText('Nouveau dossier')).toBeInTheDocument();
    });
  });

  test('affiche la liste des dossiers', async () => {
    renderDossiersPage();
    
    await waitFor(() => {
      expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      expect(screen.getByText('Marie Durand')).toBeInTheDocument();
      expect(screen.getByText('Entreprise A')).toBeInTheDocument();
      expect(screen.getByText('Entreprise B')).toBeInTheDocument();
    });
  });

  test('permet de rechercher des dossiers', async () => {
    renderDossiersPage();
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Rechercher un dossier...');
      expect(searchInput).toBeInTheDocument();
      
      fireEvent.change(searchInput, { target: { value: 'Dupont' } });
      
      // Vérifier que seul le dossier correspondant est affiché
      expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      expect(screen.queryByText('Marie Durand')).not.toBeInTheDocument();
    });
  });
});
