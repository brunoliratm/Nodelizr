import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  isLight = true;

  constructor() {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isLight = savedTheme ? savedTheme === 'light' : true;
    this.updateBodyTheme();
  }

  toggleTheme(): void {
    this.isLight = !this.isLight;
    localStorage.setItem('theme', this.isLight ? 'light' : 'dark');
    this.updateBodyTheme();
  }

  updateBodyTheme(): void {
    document.body.setAttribute('data-theme', this.isLight ? 'light' : 'dark');
  }
}
