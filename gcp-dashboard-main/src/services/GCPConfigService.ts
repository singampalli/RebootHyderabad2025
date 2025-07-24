import axios from 'axios';

const API_URL = 'http://localhost:5000/api/projects';

export interface Project {
    projectId?: string;
    projectName: string;
    projectDescription?: string;
    // Add other fields as needed
}

class GCPConfigService {
    async getProjects(): Promise<Project[]> {
        const response = await axios.get<Project[]>(API_URL);
        return response.data;
    }

    async getProject(id: string): Promise<Project> {
        const response = await axios.get<Project>(`${API_URL}/${id}`);
        return response.data;
    }

    async createProject(project: Project): Promise<Project> {
        const response = await axios.post<Project>(API_URL, project);
        return response.data;
    }

    async updateProject(id: string, project: Project): Promise<Project> {
        const response = await axios.put<Project>(`${API_URL}/${id}`, project);
        return response.data;
    }

    async deleteProject(id: string): Promise<void> {
        await axios.delete(`${API_URL}/${id}`);
    }
}

export default new GCPConfigService();