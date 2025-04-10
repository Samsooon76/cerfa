import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AlternantsPage from '../pages/AlternantsPage';
import { AuthProvider } from '../contexts/AuthContext';

// Mock de Supabase
jest.mock('../services/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockReturnValue({ data: { session: { user: { id: '1' } } }, error: null })
    }
  },
  getAlternants: jest.fn().mockResolvedValue([
    {
      id: '1',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      telephone: '0123456789',
      date_naissance: '1995-05-15',
      formation: 'Développement Web',
      adresse: '123 Rue de Paris',
      code_postal: '75001',
      ville: 'Paris'
    },
    {
      id: '2',
      nom: 'Durand',
      prenom: 'Marie',
      email: 'marie.durand@example.com',
      telephone: '0987654321',
      date_naissance: '1998-10-20',
      formation: 'Marketing Digital',
      adresse: '456 Avenue des Champs',
      code_postal: '75008',
      ville: 'Paris'
    }
  ])
}));

// Mock du Layout
jest.mock('../components/Layout/Layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>
}));

describe('AlternantsPage', () => {
  const renderAlternantsPage = () => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          <AlternantsPage />
        </BrowserRouter>
      </AuthProvider>
    );
  };

  test('affiche le titre de la page', async () => {
    renderAlternantsPage();
    
    await waitFor(() => {
      expect(screen.getByText('Alternants')).toBeInTheDocument();
    });
  });

  test('affiche le bouton de création d\'alternant', async () => {
    renderAlternantsPage();
    
    await waitFor(() => {
      expect(screen.getByText('Nouvel alternant')).toBeInTheDocument();
    });
  });

  test('affiche la liste des alternants', async () => {
    renderAlternantsPage();
    
    await waitFor(() => {
      expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      expect(screen.getByText('Marie Durand')).toBeInTheDocument();
      expect(screen.getByText('jean.dupont@example.com')).toBeInTheDocument();
      expect(screen.getByText('marie.durand@example.com')).toBeInTheDocument();
    });
  });

  test('permet de rechercher des alternants', async () => {
    renderAlternantsPage();
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Rechercher un alternant...');
      expect(searchInput).toBeInTheDocument();
      
      fireEvent.change(searchInput, { target: { value: 'Dupont' } });
      
      // Vérifier que seul l'alternant correspondant est affiché
      expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      expect(screen.queryByText('Marie Durand')).not.toBeInTheDocument();
    });
  });
});
