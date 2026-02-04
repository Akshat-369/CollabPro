import { Job } from '../../../../Data/jobs';

const API_URL = 'http://localhost:8080/api/projects';

class ProjectService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async createProject(job: Job): Promise<Job> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(job)
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create project');
    }
    return response.json();
  }

  async updateProject(job: Job): Promise<Job> {
    const response = await fetch(`${API_URL}/${job.id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(job)
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to update project');
    }
    return response.json();
  }

  async getProject(id: string): Promise<Job> {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`; // Authorization required for ownership check
    }

    const response = await fetch(`${API_URL}/${id}`, {
      headers: headers
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch project');
    }
    const data = await response.json();
    return this.mapToJob(data);
  }

  async getAllProjects(): Promise<Job[]> {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`; 
    }

    const response = await fetch(API_URL, {
      headers: headers
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch projects');
    }
    const data = await response.json();
    return data.map((d: any) => this.mapToJob(d));
  }

  private mapToJob(data: any): Job {
    return {
      ...data,
      client: data.client || {
        name: data.company || 'Unknown',
        rating: 4.5, // default Mock
        location: data.location || 'Remote',
        verified: true
      }
    };
  }

  async saveProject(id: string): Promise<void> {
    await fetch(`${API_URL}/${id}/save`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
  }

  async unsaveProject(id: string): Promise<void> {
    await fetch(`${API_URL}/${id}/save`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
  }

  async getSavedProjects(): Promise<Job[]> {
    const response = await fetch(`${API_URL}/saved`, {
        headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch saved projects');
    return response.json();
  }

  async applyForProject(id: string, formData: any): Promise<void> {
    const data = new FormData();
    data.append('coverLetter', formData.coverLetter);
    if (formData.resume) {
        data.append('resume', formData.resume);
    }
    
    // Note: Do NOT set Content-Type header when using FormData, 
    // fetch will set it correctly with boundary
    const token = localStorage.getItem('token');
    const headers: any = {
        'Authorization': `Bearer ${token}`
    };

    const response = await fetch(`${API_URL}/${id}/apply`, {
        method: 'POST',
        headers: headers,
        body: data
    });

    if (!response.ok) {
        throw new Error('Failed to apply for project');
    }
  }

  async getAppliedProjects(): Promise<string[]> {
    try {
        const apps = await this.getAppliedApplications();
        return apps.map(app => app.projectId.toString());
    } catch (e) {
        console.error("Failed to fetch applications", e);
        return [];
    }
  }

  async getAppliedApplications(): Promise<{projectId: number, status: string}[]> {
    const response = await fetch(`${API_URL}/applications/my-applications`, {
        headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch applied projects');
    return response.json();
  }

  async getProjectCandidates(projectId: string): Promise<any[]> {
    const response = await fetch(`${API_URL}/${projectId}/candidates`, {
        headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch candidates');
    return response.json();
  }

  async updateApplicationStatus(projectId: string, applicationId: number, status: string, interview?: any): Promise<void> {
    const response = await fetch(`${API_URL}/${projectId}/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, interview })
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update status');
    }
  }

  async acceptOffer(projectId: string, applicationId: number): Promise<void> {
    const response = await fetch(`${API_URL}/${projectId}/applications/${applicationId}/accept`, {
        method: 'POST',
        headers: this.getAuthHeaders()
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to accept offer');
    }
  }

  async rejectOffer(projectId: string, applicationId: number): Promise<void> {
    const response = await fetch(`${API_URL}/${projectId}/applications/${applicationId}/reject`, {
        method: 'POST',
        headers: this.getAuthHeaders()
    });
    if (!response.ok) {
         const errorText = await response.text();
         throw new Error(errorText || 'Failed to reject offer');
    }
  }

  async removeMember(projectId: string, memberId: number): Promise<void> {
    const response = await fetch(`${API_URL}/${projectId}/members/${memberId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to remove member');
    }
  }

  async getProjectMembers(projectId: string): Promise<any[]> {
    const response = await fetch(`${API_URL}/${projectId}/members`, {
        headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch project members');
    return response.json();
  }

  async getTasks(projectId: string): Promise<any[]> {
    const response = await fetch(`${API_URL}/${projectId}/tasks`, {
        headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  }

  async createTask(projectId: string, task: any): Promise<any> {
    const response = await fetch(`${API_URL}/${projectId}/tasks`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(task)
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create task');
    }
    return response.json();
  }

  // Renamed to avoid confusion with context method if imported together, though this is a class method
  async updateTask(projectId: string, taskId: string, updates: any): Promise<any> {
    const response = await fetch(`${API_URL}/${projectId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates)
    });
    if (!response.ok) {
         const error = await response.text();
         throw new Error(error || 'Failed to update task');
    }
    return response.json();
  }

  async deleteTask(projectId: string, taskId: string): Promise<void> {
    const response = await fetch(`${API_URL}/${projectId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
    });
    if (!response.ok) {
         const error = await response.text();
         throw new Error(error || 'Failed to delete task');
    }
  }

  async uploadTaskAttachment(projectId: string, taskId: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('token');
    const headers: any = {
        'Authorization': `Bearer ${token}`
    };

    const response = await fetch(`${API_URL}/${projectId}/tasks/${taskId}/attachments`, {
        method: 'POST',
        headers: headers,
        body: formData
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to upload attachment');
    }
    return response.json();
  }

  async deleteTaskAttachment(projectId: string, taskId: string, attachmentId: string): Promise<void> {
    const response = await fetch(`${API_URL}/${projectId}/tasks/${taskId}/attachments/${attachmentId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to delete attachment');
    }
  }

  // Payment Methods
  async createPaymentOrder(taskId: string): Promise<any> {
    const response = await fetch(`http://localhost:8080/api/payments/create-order/${taskId}`, {
        method: 'POST',
        headers: this.getAuthHeaders()
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create payment order');
    }
    return response.json();
  }

  async verifyPayment(payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }): Promise<void> {
    const response = await fetch(`http://localhost:8080/api/payments/verify`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Payment verification failed');
    }
  }

  async markPaymentReceived(taskId: string): Promise<void> {
    const response = await fetch(`http://localhost:8080/api/payments/received/${taskId}`, {
        method: 'POST',
        headers: this.getAuthHeaders()
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to mark payment as received');
    }
  }
}

export default new ProjectService();
