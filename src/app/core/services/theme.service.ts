import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkMode.asObservable();

  constructor(private storage: Storage, private platform: Platform) {
    this.platform.ready().then(() => {
      this.loadTheme();
    });
  }

  async initialize() {
    await this.storage.create(); // Chama create() antes de qualquer operação
  }

  async loadTheme() {
    await this.initialize();
    const savedTheme = await this.storage.get('darkMode');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const initialMode = savedTheme !== null ? savedTheme : prefersDark;
    this.setTheme(initialMode);
  }

  async toggleTheme() {
    const newMode = !this.isDarkMode.value;
    this.setTheme(newMode);
    await this.storage.set('darkMode', newMode);
  }

  private setTheme(isDark: boolean) {
    this.isDarkMode.next(isDark);
    document.body.classList.toggle('dark-theme', isDark);
  }
}
