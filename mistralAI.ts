import axios from 'axios';

// Clé API Mistral AI fournie par l'utilisateur
const MISTRAL_API_KEY = '4sYTbaijlbX4mPsxcEPt0oJC4K5FO96v';

// URL de base de l'API Mistral
const MISTRAL_API_URL = 'https://api.mistral.ai/v1';

// Interface pour les données extraites d'une carte d'identité
export interface IDCardData {
  nom?: string;
  prenom?: string;
  date_naissance?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
}

/**
 * Fonction pour extraire les informations d'une carte d'identité à partir d'une image
 * en utilisant l'API Vision de Mistral AI
 * 
 * @param imageBase64 - Image encodée en base64
 * @returns Les données extraites de la carte d'identité
 */
export const extractDataFromIDCard = async (imageBase64: string): Promise<IDCardData> => {
  try {
    const response = await axios.post(
      `${MISTRAL_API_URL}/chat/completions`,
      {
        model: 'mistral-large-latest', // Utilisation du modèle avec capacités de vision
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extrais les informations suivantes de cette carte d\'identité : nom, prénom, date de naissance, adresse complète. Réponds uniquement au format JSON avec les champs nom, prenom, date_naissance, adresse, code_postal, ville.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        temperature: 0.1, // Température basse pour des réponses plus précises
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`
        }
      }
    );

    // Extraction de la réponse JSON
    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Erreur lors de l\'extraction des données de la carte d\'identité:', error);
    throw new Error('Impossible d\'extraire les données de la carte d\'identité');
  }
};

/**
 * Fonction pour capturer une image depuis la webcam et l'encoder en base64
 * 
 * @returns Promise avec l'image encodée en base64
 */
export const captureImageFromWebcam = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      reject(new Error('Impossible de créer le contexte canvas'));
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
        video.play();

        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Capture de l'image après 1 seconde
          setTimeout(() => {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Arrêt du flux vidéo
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            
            // Conversion en base64
            const imageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];
            resolve(imageBase64);
          }, 1000);
        };
      })
      .catch(error => {
        reject(error);
      });
  });
};
