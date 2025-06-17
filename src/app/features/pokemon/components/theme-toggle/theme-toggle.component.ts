import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/core/services/theme.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ThemeToggleComponent implements OnInit {
  isDarkMode: boolean = false;

  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.isDarkMode$.subscribe((mode) => {
      this.isDarkMode = mode;
    });
  }
}
