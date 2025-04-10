import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
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
  updateDossierStatus: jest.fn().mockResolvedValue(true)
}));

// Mock des composants qui utilisent Chart.js
jest.mock('../components/Dashboard/StatisticsSection', () => ({
  __esModule: true,
  default: () => <div data-testid="statistics-section">Statistics Section</div>
}));

// Mock du Layout
jest.mock('../components/Layout/Layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>
}));

describe('DashboardPage', () => {
  const renderDashboardPage = () => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          <DashboardPage />
        </BrowserRouter>
      </AuthProvider>
    );
  };

  test('affiche la section des statistiques', async () => {
    renderDashboardPage();
    
    await waitFor(() => {
      expect(screen.getByTestId('statistics-section')).toBeInTheDocument();
    });
  });

  test('affiche le pipeline des dossiers', async () => {
    renderDashboardPage();
    
    await waitFor(() => {
      expect(screen.getByText('Pipeline des dossiers')).toBeInTheDocument();
    });
  });

  test('affiche les dossiers chargés', async () => {
    renderDashboardPage();
    
    await waitFor(() => {
      expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      expect(screen.getByText('Marie Durand')).toBeInTheDocument();
    });
  });
});
