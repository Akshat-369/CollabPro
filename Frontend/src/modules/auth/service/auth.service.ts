export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
}

const API_URL = 'http://localhost:8080/api/auth';

class AuthService {
  async login(request: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  async register(request: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('manage_activeTab');
    localStorage.removeItem('manage_statusTab');
    localStorage.removeItem('manage_sortOption');
    localStorage.removeItem('browse_activeTab');
    localStorage.removeItem('browse_historyTab');
    localStorage.removeItem('browse_sortOption');
  }

  getCurrentUser(): Promise<User> {
    const token = localStorage.getItem('token');
    return fetch(`${API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }).then(async response => {
        if (!response.ok) {
            throw new Error('Unauthorized');
        }
        return response.json();
    });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  async forgotPassword(email: string): Promise<void> {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    // Always return success to UI to avoid enumeration
    if (!response.ok) {
       // Log internal error but don't expose it unless critical
       // Or throw if you want to handle "Network Error"
    }
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    const response = await fetch(`${API_URL}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    if (!response.ok) {
        throw new Error('Invalid or Expired OTP');
    }
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });
    if (!response.ok) {
        throw new Error('Failed to reset password');
    }
  }
}

export default new AuthService();
