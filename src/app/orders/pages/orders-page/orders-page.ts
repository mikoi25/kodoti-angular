import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { authService } from '../../../auth/services/auth.service';

@Component({
  imports: [RouterOutlet,RouterLinkActive,RouterLink],
  selector: 'app-orders-page',
  styleUrl: './orders-page.css',
  templateUrl: './orders-page.html',
})
export class OrdersPage {
    readonly sidebarOpen = signal(false);
  readonly clock = signal('');
  private timer?: ReturnType<typeof setInterval>;
  private router = inject(Router);
  private auth = inject(authService);


  ngOnInit(): void {
    this.updateClock();
    this.timer = setInterval(() => this.updateClock(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private updateClock(): void {
    const now = new Date();
    this.clock.set(now.toString().replace(/GMT.*/, '') + '(hora estándar de Chile)');
  }

  openSidebar(): void {
    this.sidebarOpen.set(true);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
