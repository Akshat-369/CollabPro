import { UserProfile } from '../../../../Data/types';

const API_URL = 'http://localhost:8080/api/profile';

class ProfileService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getMyProfile(): Promise<UserProfile> {
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  }

  async updateMyProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetch(`${API_URL}/me`, {
      method: 'PUT', // or PATCH, backend used PUT for matching req
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  }

  async uploadProfileImage(file: File): Promise<string> {
    const formData = new FormData();
    // "Field name: profileImage"
    formData.append('profileImage', file);
    
    // "DO NOT set Content-Type" (Browser handles boundary)
    const token = localStorage.getItem('token');
    const headers: any = {
        'Authorization': `Bearer ${token}`
    };

    // "PUT /api/profile/me/image"
    const response = await fetch(`${API_URL}/me/image`, {
      method: 'PUT',
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload image');
    }

    return response.text();
  }
}

export default new ProfileService();
