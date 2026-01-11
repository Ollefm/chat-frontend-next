import {
  API_BASE_URL,
  DEFAULT_FETCH_OPTIONS,
  HTTP_ERROR_MESSAGES,
} from "@/config/constants";

export class APIClient {
  private readonly baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string): Promise<T> {
    const url = this.getFullURL(endpoint);
    const response = await fetch(url, {
      ...DEFAULT_FETCH_OPTIONS,
      method: "GET",
    });
    if (!response.ok) await this.handleErrorResponse(response);
    return response.json();
  }

  async post<T>(
    endpoint: string,
    body?: Record<string, unknown> | null
  ): Promise<T> {
    const url = this.getFullURL(endpoint);
    const response = await fetch(url, {
      ...DEFAULT_FETCH_OPTIONS,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) await this.handleErrorResponse(response);
    return response.json();
  }

  async put<T>(
    endpoint: string,
    body?: Record<string, unknown> | null
  ): Promise<T> {
    const url = this.getFullURL(endpoint);
    const response = await fetch(url, {
      ...DEFAULT_FETCH_OPTIONS,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) await this.handleErrorResponse(response);
    return response.json();
  }

  async patch<T>(
    endpoint: string,
    body?: Record<string, unknown> | null
  ): Promise<T> {
    const url = this.getFullURL(endpoint);
    const response = await fetch(url, {
      ...DEFAULT_FETCH_OPTIONS,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) await this.handleErrorResponse(response);
    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const url = this.getFullURL(endpoint);
    const response = await fetch(url, {
      ...DEFAULT_FETCH_OPTIONS,
      method: "DELETE",
    });
    if (!response.ok) await this.handleErrorResponse(response);
    return response.json();
  }

  //Helpers
  private getFullURL(endpoint: string): string {
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
      return endpoint;
    }
    return `${this.baseURL}${endpoint}`;
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    const status = response.status;
    let errorMessage: string;

    try {
      const text = await response.text();
      if (text) {
        try {
          const json = JSON.parse(text);
          errorMessage = json.message || json.error || text;
        } catch {
          errorMessage = text;
        }
      } else {
        errorMessage =
          HTTP_ERROR_MESSAGES[status] ||
          `HTTP Error: ${status} ${response.statusText}`;
      }
    } catch {
      errorMessage =
        HTTP_ERROR_MESSAGES[status] ||
        `HTTP Error: ${status} ${response.statusText}`;
    }

    const error = new Error(errorMessage);
    (error as any).status = status;
    throw error;
  }
}

export const apiClient = new APIClient();
