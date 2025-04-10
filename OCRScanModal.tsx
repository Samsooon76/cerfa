import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { CameraAlt as CameraIcon } from '@mui/icons-material';
import { captureImageFromWebcam, extractDataFromIDCard, IDCardData } from '../../utils/mistralAI';

interface OCRScanModalProps {
  open: boolean;
  onClose: () => void;
  onDataExtracted: (data: IDCardData) => void;
}

const OCRScanModal: React.FC<OCRScanModalProps> = ({ open, onClose, onDataExtracted }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleScan = async () => {
    try {
      setScanning(true);
      setError(null);
      
      // Capture de l'image depuis la webcam
      const imageBase64 = await captureImageFromWebcam();
      
      // Extraction des données avec Mistral AI
      const data = await extractDataFromIDCard(imageBase64);
      
      // Envoi des données extraites au composant parent
      onDataExtracted(data);
      
      // Fermeture du modal
      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'analyse de la carte d'identité");
    } finally {
      setScanning(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        Scanner une carte d'identité
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', p: 2 }}>
          {scanning ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography>Analyse en cours...</Typography>
            </Box>
          ) : (
            <>
              <Box 
                sx={{ 
                  width: '100%', 
                  height: 300, 
                  backgroundColor: '#f5f5f5', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  mb: 2
                }}
              >
                <video ref={videoRef} style={{ display: 'none' }} />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <CameraIcon sx={{ fontSize: 60, color: '#aaa' }} />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Placez votre carte d'identité face à la caméra et assurez-vous qu'elle est bien visible et lisible.
              </Typography>
              
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          onClick={handleScan} 
          variant="contained"
          disabled={scanning}
          sx={{ 
            backgroundColor: 'black',
            '&:hover': {
              backgroundColor: '#333',
            }
          }}
        >
          {scanning ? 'Analyse en cours...' : 'Scanner'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OCRScanModal;
