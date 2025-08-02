import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { EcoLog } from '../models/eco-log.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public logs: EcoLog[] = [];

  constructor(
    private storageService: StorageService,
    private sanitizer: DomSanitizer // Para las rutas de las imágenes
  ) { }

  // ionViewWillEnter se ejecuta cada vez que la página está a punto de mostrarse
  ionViewWillEnter() {
    this.loadLogs();
  }

  async loadLogs() {
    this.logs = await this.storageService.getLogs();
  }

  // Función para obtener una URL segura para las imágenes de la cámara
  getPhoto(path: string | undefined): SafeResourceUrl | string {
    return path ? this.sanitizer.bypassSecurityTrustResourceUrl(path) : '';
  }
}