import { Component } from '@angular/core';
import { AlertController, ToastController, Platform } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Haptics } from '@capacitor/haptics';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { StorageService } from '../services/storage.service';
import { EcoLog } from '../models/eco-log.interface';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonIcon
  ]
})
export class Tab1Page {

  constructor(
    private storageService: StorageService,
    private alertController: AlertController,
    private toastController: ToastController,
    private platform: Platform
  ) { }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri, // Importante para guardar en el dispositivo
        source: CameraSource.Camera
      });

      // Pedir una descripción al usuario
      const alert = await this.alertController.create({
        header: 'Añadir Descripción',
        message: 'Ingresa una breve descripción para la foto.',
        inputs: [
          {
            name: 'description',
            type: 'text',
            placeholder: 'Ej: Botellas de plástico recolectadas'
          }
        ],
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Guardar',
            handler: async (data) => {
              const newLog: EcoLog = {
                id: new Date().toISOString(),
                type: 'photo',
                timestamp: Date.now(),
                imageData: image.webPath, // webPath es accesible por el WebView
                description: data.description || 'Sin descripción'
              };
              await this.storageService.addLog(newLog);
              this.showFeedback('¡Foto guardada con éxito!');
            }
          }
        ]
      });

      await alert.present();

    } catch (error) {
      console.error('Error al tomar la foto', error);
      this.showFeedback('Error: No se pudo tomar la foto.', 'danger');
    }
  }

  // Función de utilidad para mostrar feedback
  async showFeedback(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
    Haptics.vibrate(); // Vibración
  }
  async scanQrCode() {
    // Solo funciona en dispositivos nativos
    if (!this.platform.is('capacitor')) {
      this.showFeedback('El escáner QR solo funciona en un dispositivo móvil.', 'warning');
      return;
    }

    try {
      // 1. Ocultar el fondo de la web
      document.body.classList.add('qr-scanner-active');

      // 2. Pedir permiso
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.denied) {
        this.showFeedback('Permiso de cámara denegado.', 'danger');
        return;
      }

      // 3. Iniciar el escaneo
      const result = await BarcodeScanner.startScan();

      // 4. Si tenemos un resultado
      if (result.hasContent) {
        const newLog: EcoLog = {
          id: new Date().toISOString(),
          type: 'qr',
          timestamp: Date.now(),
          qrData: result.content
        };
        await this.storageService.addLog(newLog);
        this.showFeedback(`Código escaneado: ${result.content}`);
      }
    } catch (error) {
      console.error('Error en el escáner', error);
      this.showFeedback('Error al escanear el código.', 'danger');
    } finally {
      // 5. Asegurarse de que siempre se detenga el escaneo y se restaure la UI
      document.body.classList.remove('qr-scanner-active');
      BarcodeScanner.stopScan();
    }
  }
  async recordLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const newLog: EcoLog = {
        id: new Date().toISOString(),
        type: 'location',
        timestamp: Date.now(),
        locationData: {
          latitude: coordinates.coords.latitude,
          longitude: coordinates.coords.longitude
        }
      };
      await this.storageService.addLog(newLog);
      this.showFeedback('Ubicación guardada correctamente.');

    } catch (error) {
      console.error('Error al obtener la ubicación', error);
      this.showFeedback('Error: No se pudo obtener la ubicación.', 'danger');
    }
  }
}
