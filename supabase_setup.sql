-- Script SQL pour la configuration de la base de données Supabase pour AlterManager

-- Activation de l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des profils utilisateurs (extension de la table auth.users gérée par Supabase)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nom TEXT,
  prenom TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des alternants
CREATE TABLE alternants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT UNIQUE,
  telephone TEXT,
  date_naissance DATE,
  adresse TEXT,
  code_postal TEXT,
  ville TEXT,
  formation TEXT,
  niveau TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des entreprises
CREATE TABLE entreprises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  siret TEXT UNIQUE,
  adresse TEXT,
  code_postal TEXT,
  ville TEXT,
  email TEXT,
  telephone TEXT,
  secteur TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des tuteurs
CREATE TABLE tuteurs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT UNIQUE,
  telephone TEXT,
  entreprise_id UUID REFERENCES entreprises(id),
  fonction TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des dossiers
CREATE TABLE dossiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alternant_id UUID REFERENCES alternants(id) NOT NULL,
  entreprise_id UUID REFERENCES entreprises(id) NOT NULL,
  tuteur_id UUID REFERENCES tuteurs(id) NOT NULL,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  statut TEXT DEFAULT 'REQUEST' CHECK (statut IN ('REQUEST', 'CREATED', 'VERIFICATION', 'PROCESSING')),
  commentaires TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dossier_id UUID REFERENCES dossiers(id) NOT NULL,
  nom TEXT NOT NULL,
  type TEXT NOT NULL,
  taille INTEGER NOT NULL,
  chemin TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création d'un bucket de stockage pour les documents
-- Note: Cette partie doit être effectuée manuellement dans l'interface Supabase

-- Politiques de sécurité Row Level Security (RLS)

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE alternants ENABLE ROW LEVEL SECURITY;
ALTER TABLE entreprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE tuteurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Politique pour profiles: les utilisateurs peuvent voir et modifier leur propre profil
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Politique pour alternants: tous les utilisateurs authentifiés peuvent voir et modifier
CREATE POLICY "Les utilisateurs authentifiés peuvent voir les alternants" 
  ON alternants FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs authentifiés peuvent ajouter des alternants" 
  ON alternants FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs authentifiés peuvent modifier les alternants" 
  ON alternants FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Politique pour entreprises: tous les utilisateurs authentifiés peuvent voir et modifier
CREATE POLICY "Les utilisateurs authentifiés peuvent voir les entreprises" 
  ON entreprises FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs authentifiés peuvent ajouter des entreprises" 
  ON entreprises FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs authentifiés peuvent modifier les entreprises" 
  ON entreprises FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Politique pour tuteurs: tous les utilisateurs authentifiés peuvent voir et modifier
CREATE POLICY "Les utilisateurs authentifiés peuvent voir les tuteurs" 
  ON tuteurs FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs authentifiés peuvent ajouter des tuteurs" 
  ON tuteurs FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs authentifiés peuvent modifier les tuteurs" 
  ON tuteurs FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Politique pour dossiers: tous les utilisateurs authentifiés peuvent voir et modifier
CREATE POLICY "Les utilisateurs authentifiés peuvent voir les dossiers" 
  ON dossiers FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs authentifiés peuvent ajouter des dossiers" 
  ON dossiers FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs authentifiés peuvent modifier les dossiers" 
  ON dossiers FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Politique pour documents: tous les utilisateurs authentifiés peuvent voir et modifier
CREATE POLICY "Les utilisateurs authentifiés peuvent voir les documents" 
  ON documents FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs authentifiés peuvent ajouter des documents" 
  ON documents FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Triggers pour mettre à jour le champ updated_at

-- Fonction pour mettre à jour le champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Trigger pour alternants
CREATE TRIGGER update_alternants_updated_at
BEFORE UPDATE ON alternants
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Trigger pour entreprises
CREATE TRIGGER update_entreprises_updated_at
BEFORE UPDATE ON entreprises
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Trigger pour tuteurs
CREATE TRIGGER update_tuteurs_updated_at
BEFORE UPDATE ON tuteurs
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Trigger pour dossiers
CREATE TRIGGER update_dossiers_updated_at
BEFORE UPDATE ON dossiers
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Données de test (optionnel)

-- Insertion d'entreprises de test
INSERT INTO entreprises (nom, siret, adresse, code_postal, ville, email, telephone, secteur)
VALUES 
  ('Entreprise A', '12345678901234', '123 Rue de Paris', '75001', 'Paris', 'contact@entreprisea.com', '0123456789', 'Informatique'),
  ('Entreprise B', '98765432109876', '456 Avenue des Champs', '75008', 'Paris', 'contact@entrepriseb.com', '0987654321', 'Marketing');

-- Insertion de tuteurs de test
INSERT INTO tuteurs (nom, prenom, email, telephone, entreprise_id, fonction)
VALUES 
  ('Martin', 'Sophie', 'sophie.martin@entreprisea.com', '0123456789', (SELECT id FROM entreprises WHERE nom = 'Entreprise A'), 'Responsable RH'),
  ('Petit', 'Thomas', 'thomas.petit@entrepriseb.com', '0987654321', (SELECT id FROM entreprises WHERE nom = 'Entreprise B'), 'Directeur Marketing');

-- Insertion d'alternants de test
INSERT INTO alternants (nom, prenom, email, telephone, date_naissance, adresse, code_postal, ville, formation, niveau)
VALUES 
  ('Dupont', 'Jean', 'jean.dupont@example.com', '0123456789', '1995-05-15', '123 Rue de Paris', '75001', 'Paris', 'Développement Web', 'Master'),
  ('Durand', 'Marie', 'marie.durand@example.com', '0987654321', '1998-10-20', '456 Avenue des Champs', '75008', 'Paris', 'Marketing Digital', 'Licence');

-- Insertion de dossiers de test
INSERT INTO dossiers (alternant_id, entreprise_id, tuteur_id, date_debut, date_fin, statut, commentaires)
VALUES 
  ((SELECT id FROM alternants WHERE nom = 'Dupont'), (SELECT id FROM entreprises WHERE nom = 'Entreprise A'), (SELECT id FROM tuteurs WHERE nom = 'Martin'), '2023-01-01', '2023-12-31', 'REQUEST', 'Dossier en attente de validation'),
  ((SELECT id FROM alternants WHERE nom = 'Durand'), (SELECT id FROM entreprises WHERE nom = 'Entreprise B'), (SELECT id FROM tuteurs WHERE nom = 'Petit'), '2023-02-01', '2024-01-31', 'CREATED', 'Dossier créé, en attente de documents');
