import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';

export type UserRole = 'regular user' | 'monitoring admin' | 'web admin';

/**
 * Mocking a NoSQL User Document
 */
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string | null;
  signature?: string;
  role: UserRole;
  permissions: string[];
  createdAt: Date;
  metadata: {
    lastLogin: Date;
    loginCount: number;
    settings: Record<string, any>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NoSqlAuthService {
  private currentUserSignal = signal<User | null>(null);

  // Mock data stored in a "NoSQL Collection" (simulated by a Map/Array)
  private usersCollection: any[] = [
    {
      id: '507f1f77bcf86cd799439000', // OMS Admin
      username: 'omsadmin',
      password: 'password123',
      email: 'omsadmin@optima.com',
      fullName: 'OMS Administrator',
      signature: '<p>Warm regards,</p><p><br></p><p><b>omsadmin</b></p>',
      role: 'web admin',
      permissions: ['view_dashboard', 'view_devices', 'view_apps', 'view_reports', 'view_alerts', 'manage_users'],
      createdAt: new Date('2025-01-01'),
      metadata: {
        lastLogin: new Date(),
        loginCount: 1,
        settings: { theme: 'light' }
      }
    },
    {
      id: '507f1f77bcf86cd799439011', // Web Admin
      username: 'webadmin',
      password: 'password123',
      email: 'webadmin@optima.com',
      fullName: 'Web Administrator',
      signature: '<p>Warm regards,</p><p><br></p><p><b>webadmin</b></p>',
      role: 'web admin',
      permissions: ['view_dashboard', 'view_devices', 'view_apps', 'view_reports', 'view_alerts', 'manage_users'],
      createdAt: new Date('2025-01-01'),
      metadata: {
        lastLogin: new Date(),
        loginCount: 15,
        settings: { theme: 'light' }
      }
    },
    {
      id: '507f1f77bcf86cd799439022', // Monitoring Admin
      username: 'monadmin',
      password: 'password123',
      email: 'monadmin@optima.com',
      fullName: 'Monitoring Administrator',
      signature: '<p>Warm regards,</p><p><br></p><p><b>monadmin</b></p>',
      role: 'monitoring admin',
      permissions: ['view_dashboard', 'view_devices', 'view_reports', 'view_alerts'],
      createdAt: new Date('2025-02-01'),
      metadata: {
        lastLogin: new Date(),
        loginCount: 5,
        settings: { theme: 'light' }
      }
    },
    {
      id: '507f1f77bcf86cd799439033', // Regular User
      username: 'user',
      password: 'password123',
      email: 'user@optima.com',
      fullName: 'Regular User',
      signature: '<p>Warm regards,</p><p><br></p><p><b>user</b></p>',
      role: 'regular user',
      permissions: ['view_dashboard'],
      createdAt: new Date('2025-03-01'),
      metadata: {
        lastLogin: new Date(),
        loginCount: 2,
        settings: { theme: 'light' }
      }
    },
    {
      id: '507f1f77bcf86cd799439044', // New Regular User for Verification
      username: 'omsuser',
      password: 'password123',
      email: 'omsuser@optima.com',
      fullName: 'OMS User',
      signature: '<p>Warm regards,</p><p><br></p><p><b>omsuser</b></p>',
      role: 'regular user',
      permissions: ['view_dashboard'],
      createdAt: new Date('2025-03-15'),
      metadata: {
        lastLogin: new Date(),
        loginCount: 0,
        settings: { theme: 'light' }
      }
    }
  ];

  constructor() {
    // Check if user is already logged in (simulated persistence)
    const storedUser = localStorage.getItem('oms_session');
    if (storedUser) {
      this.currentUserSignal.set(JSON.parse(storedUser));
    }
  }

  get currentUser() {
    return this.currentUserSignal.asReadonly();
  }

  login(username: string, password: string): Observable<User> {
    // Simulating a NoSQL query like: db.users.find({ username, password })
    const userDoc = this.usersCollection.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password.trim()
    );

    if (userDoc) {
      // Don't expose password in the returned user object
      const { password: _, ...userWithoutPassword } = userDoc;

      // Update metadata (simulating Atomic Update in NoSQL)
      userDoc.metadata.lastLogin = new Date();
      userDoc.metadata.loginCount++;

      this.currentUserSignal.set(userWithoutPassword as User);
      localStorage.setItem('oms_session', JSON.stringify(userWithoutPassword));

      return of(userWithoutPassword as User).pipe(delay(800)); // Simulate DB latency
    } else {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(800));
    }
  }

  register(userData: { fullname: string, username: string, email: string, password: string }): Observable<User> {
    // Check if user already exists
    const existingUser = this.usersCollection.find(
      u => u.username.toLowerCase() === userData.username.trim().toLowerCase()
    );

    if (existingUser) {
      return throwError(() => new Error('Username already exists')).pipe(delay(800));
    }

    // Create a new NoSQL document with default values
    const newUser: any = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      username: userData.username.trim(),
      password: userData.password, // In a real app, this would be hashed
      email: userData.email.trim(),
      fullName: userData.fullname.trim(),
      signature: `<p>Warm regards,</p><p><br></p><p><b>${userData.username.trim()}</b></p>`,
      role: 'regular user' as UserRole, // Default role
      permissions: ['view_dashboard'], // Default permissions
      createdAt: new Date(),
      metadata: {
        lastLogin: new Date(),
        loginCount: 0,
        settings: { theme: 'light' }
      }
    };

    // Simulate "insert" into NoSQL collection
    this.usersCollection.push(newUser);

    // Return the new user (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    return of(userWithoutPassword as User).pipe(delay(1000));
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('oms_session');
  }

  isAuthenticated(): boolean {
    return this.currentUserSignal() !== null;
  }

  updateProfile(profileData: { fullName: string, email: string, avatar?: string | null, signature?: string }): Observable<User> {
    const user = this.currentUserSignal();
    if (!user) return throwError(() => new Error('Not authenticated'));

    const userDoc = this.usersCollection.find(u => u.id === user.id);
    if (!userDoc) return throwError(() => new Error('User not found'));

    // Update the "NoSQL Document"
    userDoc.fullName = profileData.fullName;
    userDoc.email = profileData.email;
    if (profileData.avatar) {
      userDoc.avatar = profileData.avatar;
    } else if (profileData.avatar === null) {
      // Support explicitly clearing the avatar if needed
      delete userDoc.avatar;
    }

    // Server-side (simulated) additional safety check
    if (profileData.signature !== undefined) {
      // In a real backend, we'd use a library like DOMPurify or a server-side equivalent
      // to ensure the HTML is clean before persistence.
      userDoc.signature = profileData.signature;
    }

    // Update the signal and local storage
    const { password: _, ...userWithoutPassword } = userDoc;
    this.currentUserSignal.set(userWithoutPassword as User);
    localStorage.setItem('oms_session', JSON.stringify(userWithoutPassword));

    return of(userWithoutPassword as User).pipe(delay(500));
  }

  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    const user = this.currentUserSignal();
    if (!user) return throwError(() => new Error('Not authenticated'));

    const userDoc = this.usersCollection.find(u => u.id === user.id);
    if (!userDoc) return throwError(() => new Error('User not found'));

    if (userDoc.password !== currentPassword) {
      return throwError(() => new Error('Current password is incorrect'));
    }

    userDoc.password = newPassword;
    return of(true).pipe(delay(500));
  }
}
