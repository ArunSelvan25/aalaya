import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar-component',
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent {
  private router: Router = inject(Router);
  private authService = inject(AuthService);

  isPropertiesActive(): boolean {
    return (
      this.router.url.startsWith('/properties') ||
      this.router.url.startsWith('/property/')
    );
  }

  logout() {
    this.authService.logout();
  }
}
