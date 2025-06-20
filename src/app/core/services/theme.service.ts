import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  private storageInitialized = false;

  // Observable público com otimizações
  isDarkMode$ = this.isDarkMode
    .asObservable()
    .pipe(debounceTime(50), distinctUntilChanged());

  constructor(
    private storage: Storage,
    private platform: Platform,
    private ngZone: NgZone
  ) {
    this.initTheme();
  }

  private async initTheme() {
    try {
      await this.platform.ready();
      await this.initializeStorage();

      // Verifica o tema preferido do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

      // Configura listener para mudanças no tema do sistema
      prefersDark.addEventListener('change', (mediaQuery) => {
        this.ngZone.run(() => {
          if (this.storageInitialized) {
            this.setTheme(mediaQuery.matches, false); // Não salva no storage
          }
        });
      });

      // Carrega o tema salvo ou usa o preferido
      const savedTheme = await this.storage.get('darkMode');
      const initialMode =
        savedTheme !== null ? savedTheme : prefersDark.matches;
      this.setTheme(initialMode, false);
    } catch (error) {
      console.error('Error initializing theme:', error);
    }
  }

  private async initializeStorage() {
    if (!this.storageInitialized) {
      await this.storage.create();
      this.storageInitialized = true;
    }
  }

  async toggleTheme() {
    // Adiciona classe para otimizar a transição
    document.body.classList.add('theme-changing');

    const newMode = !this.isDarkMode.value;
    await this.setTheme(newMode, true);

    // Remove a classe após a transição
    setTimeout(() => {
      document.body.classList.remove('theme-changing');
    }, 300);
  }

  private async setTheme(isDark: boolean, saveToStorage: boolean) {
    // Otimização: Executa fora do Angular para melhor performance
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        document.body.classList.toggle('dark-theme', isDark);

        // Força uma repaint para evitar gargalos
        this.forceRepaint();
      });
    });

    this.isDarkMode.next(isDark);

    if (saveToStorage && this.storageInitialized) {
      try {
        await this.storage.set('darkMode', isDark);
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    }
  }

  private forceRepaint() {
    // Técnica para forçar repaint e melhorar performance
    document.body.style.visibility = 'hidden';
    document.body.style.visibility = 'visible';
  }
}
