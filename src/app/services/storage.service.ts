import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { EcoLog } from '../models/eco-log.interface';

const LOGS_KEY = 'eco_logs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // Obtener todos los registros, ordenados del más reciente al más antiguo
  async getLogs(): Promise<EcoLog[]> {
    const result = await Preferences.get({ key: LOGS_KEY });
    const logs = result.value ? JSON.parse(result.value) : [];

    // Ordenar por timestamp descendente
    return logs.sort((a: EcoLog, b: EcoLog) => b.timestamp - a.timestamp);
  }

  // Añadir un nuevo registro
  async addLog(log: EcoLog): Promise<void> {
    const logs = await this.getLogs();

    logs.unshift(log);

    await Preferences.set({
      key: LOGS_KEY,
      value: JSON.stringify(logs)
    });
  }
}
