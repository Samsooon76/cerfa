import { createClient } from '@supabase/supabase-js';

// Ces valeurs devront être remplacées par les vraies valeurs de votre projet Supabase
// Pour un projet réel, ces valeurs devraient être dans des variables d'environnement
const supabaseUrl = 'https://your-supabase-project-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour les tables principales
export type Tuteur = {
  id: string;
  created_at: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  user_id: string;
};

export type Alternant = {
  id: string;
  created_at: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  date_naissance: string;
  adresse: string;
  code_postal: string;
  ville: string;
  formation: string;
};

export type Entreprise = {
  id: string;
  created_at: string;
  nom: string;
  siret: string;
  adresse: string;
  code_postal: string;
  ville: string;
  telephone: string;
  email: string;
};

export type Dossier = {
  id: string;
  created_at: string;
  alternant_id: string;
  entreprise_id: string;
  tuteur_id: string;
  statut: 'REQUEST' | 'CREATED' | 'VERIFICATION' | 'PROCESSING';
  date_debut: string;
  date_fin: string;
  commentaires: string;
};

// Fonctions d'accès aux données
export const getAlternants = async () => {
  const { data, error } = await supabase
    .from('alternants')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const getDossiers = async () => {
  const { data, error } = await supabase
    .from('dossiers')
    .select(`
      *,
      alternant:alternant_id(id, nom, prenom),
      entreprise:entreprise_id(id, nom),
      tuteur:tuteur_id(id, nom, prenom)
    `);
  
  if (error) throw error;
  return data;
};

export const updateDossierStatus = async (id: string, statut: 'REQUEST' | 'CREATED' | 'VERIFICATION' | 'PROCESSING') => {
  const { data, error } = await supabase
    .from('dossiers')
    .update({ statut })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
};

export const createAlternant = async (alternant: Omit<Alternant, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('alternants')
    .insert([alternant])
    .select();
  
  if (error) throw error;
  return data;
};

export const createDossier = async (dossier: Omit<Dossier, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('dossiers')
    .insert([dossier])
    .select();
  
  if (error) throw error;
  return data;
};

export const deleteDossier = async (id: string) => {
  const { error } = await supabase
    .from('dossiers')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Schéma SQL pour la création des tables dans Supabase
export const databaseSchema = `
-- Création de la table des tuteurs
CREATE TABLE tuteurs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telephone TEXT,
  user_id UUID REFERENCES auth.users(id)
);

-- Création de la table des alternants
CREATE TABLE alternants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telephone TEXT,
  date_naissance DATE,
  adresse TEXT,
  code_postal TEXT,
  ville TEXT,
  formation TEXT
);

-- Création de la table des entreprises
CREATE TABLE entreprises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nom TEXT NOT NULL,
  siret TEXT UNIQUE,
  adresse TEXT,
  code_postal TEXT,
  ville TEXT,
  telephone TEXT,
  email TEXT
);

-- Création de la table des dossiers
CREATE TABLE dossiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  alternant_id UUID REFERENCES alternants(id) NOT NULL,
  entreprise_id UUID REFERENCES entreprises(id) NOT NULL,
  tuteur_id UUID REFERENCES tuteurs(id) NOT NULL,
  statut TEXT CHECK (statut IN ('REQUEST', 'CREATED', 'VERIFICATION', 'PROCESSING')) NOT NULL DEFAULT 'REQUEST',
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  commentaires TEXT
);

-- Création de la table des profils utilisateurs
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT CHECK (role IN ('admin', 'user')) NOT NULL DEFAULT 'user'
);

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour le timestamp updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Création d'un bucket pour le stockage des documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);
`;
