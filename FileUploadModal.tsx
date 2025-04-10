import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { FileUpload as FileUploadIcon } from '@mui/icons-material';
import { supabase } from '../../services/supabaseClient';

interface FileUploadModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  acceptedTypes: string;
  maxSize?: number; // en MB
  onUploadSuccess?: (fileUrl: string) => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ 
  open, 
  onClose, 
  title,
  acceptedTypes,
  maxSize = 5,
  onUploadSuccess
}) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    // Vérifier la taille du fichier
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`Le fichier est trop volumineux. Taille maximale: ${maxSize}MB`);
      setFile(null);
      return;
    }
    
    // Vérifier le type du fichier
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    const acceptedExtensions = acceptedTypes.split(',').map(type => 
      type.trim().replace('.', '').toLowerCase()
    );
    
    if (fileExtension && !acceptedExtensions.includes(fileExtension)) {
      setError(`Type de fichier non accepté. Types acceptés: ${acceptedTypes}`);
      setFile(null);
      return;
    }
    
    setError(null);
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Générer un nom de fichier unique
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
      
      // Uploader le fichier vers Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      // Obtenir l'URL publique du fichier
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);
      
      setSuccess(true);
      
      if (onUploadSuccess) {
        onUploadSuccess(publicUrl);
      }
      
      // Fermer le modal après un court délai
      setTimeout(() => {
        onClose();
        setFile(null);
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'upload du fichier");
    } finally {
      setLoading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{title}</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept={acceptedTypes}
            />
            
            <Button
              variant="outlined"
              component="span"
              startIcon={<FileUploadIcon />}
              onClick={handleBrowseClick}
              sx={{ 
                p: 2, 
                border: '2px dashed #ccc', 
                borderRadius: 2, 
                width: '100%',
                height: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {file ? file.name : 'Sélectionner un fichier'}
              {!file && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Glissez-déposez ou cliquez pour parcourir
                </Typography>
              )}
            </Button>
            
            <Typography variant="caption" display="block" sx={{ mt: 2 }}>
              Formats acceptés: {acceptedTypes} (max {maxSize}MB)
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} disabled={loading}>Annuler</Button>
          <Button 
            variant="contained"
            onClick={handleUpload}
            disabled={!file || loading}
            sx={{ 
              backgroundColor: 'black',
              '&:hover': {
                backgroundColor: '#333',
              }
            }}
          >
            {loading ? 'Upload en cours...' : 'Importer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Fichier importé avec succès !
        </Alert>
      </Snackbar>
    </>
  );
};

export default FileUploadModal;
