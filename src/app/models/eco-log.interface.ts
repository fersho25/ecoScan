export interface EcoLog {
    id: string; // Un ID único para cada registro
    type: 'photo' | 'qr' | 'location';
    timestamp: number; // Para ordenar fácilmente

    // Datos específicos del tipo
    imageData?: string; // Para la ruta de la foto
    description?: string; // Para la foto
    qrData?: string; // Para el contenido del QR
    locationData?: {
        latitude: number;
        longitude: number;
    };
}