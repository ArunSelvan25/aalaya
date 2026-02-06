import { Component } from '@angular/core';
import {NavbarComponent} from '../navbar-component/navbar-component';
import {RouterOutlet} from '@angular/router';
import {SidebarComponent} from '../sidebar-component/sidebar-component';

@Component({
  selector: 'app-auth-layout-component',
  imports: [
    RouterOutlet,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './auth-layout-component.html',
  styleUrl: './auth-layout-component.css',
})
export class AuthLayoutComponent {

}
