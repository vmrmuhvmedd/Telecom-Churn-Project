import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  pageTitle: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('dashboard')) {
          this.pageTitle = 'Dashboard';
        } else if (event.url.includes('model')) {
          this.pageTitle = 'Model';
        } else {
          this.pageTitle = 'Telecom Project';
        }
      }
    });
  }
}
