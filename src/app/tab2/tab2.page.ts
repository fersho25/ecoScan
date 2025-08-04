import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StorageService } from '../services/storage.service';
import { EcoLog } from '../models/eco-log.interface';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { NgIf, NgFor, NgSwitch, NgSwitchCase, DatePipe } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonCard,
    IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonIcon,
    NgIf, NgFor, NgSwitch, NgSwitchCase, DatePipe
  ]
})
export class Tab2Page {
  public logs: EcoLog[] = [];

  constructor(
    private storageService: StorageService,
    private sanitizer: DomSanitizer
  ) { }

  ionViewWillEnter() {
    this.loadLogs();
  }

  async loadLogs() {
    this.logs = await this.storageService.getLogs();
  }

  getPhoto(path: string | undefined): SafeResourceUrl | string {
    return path ? this.sanitizer.bypassSecurityTrustResourceUrl(path) : '';
  }
}
