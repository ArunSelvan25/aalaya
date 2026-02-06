import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Manager' | 'Landlord';
    avatar?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    currentUser = signal<User | null>(null);

    constructor(private router: Router) { }

    login(email: string, password: string): boolean {
        // Mock login logic
        if (email && password) {
            const user: User = {
                id: 'u-123',
                name: 'Arun Balaji',
                email: email,
                role: 'Admin',
                avatar: 'https://ui-avatars.com/api/?name=Arun+Balaji&background=0D8ABC&color=fff'
            };
            this.currentUser.set(user);
            this.router.navigate(['/dashboard']);
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return !!this.currentUser();
    }
}
