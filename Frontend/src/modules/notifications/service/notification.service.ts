const API_URL = 'http://localhost:8080/api';
import AuthService from '../../auth/service/auth.service';

export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

class NotificationService {
  private getAuthHeaders() {
    const token = AuthService.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getNotifications(): Promise<Notification[]> {
    const response = await fetch(`${API_URL}/notifications`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  }

  async getUnreadCount(): Promise<number> {
    const response = await fetch(`${API_URL}/notifications/unread-count`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch unread count');
    return response.json();
  }

  async markAsRead(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to mark as read');
  }

  async markAllAsRead(): Promise<void> {
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to mark all as read');
  }
}

export default new NotificationService();
