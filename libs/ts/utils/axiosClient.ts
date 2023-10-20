import axios, { AxiosInstance } from "axios";

interface IClient {
    post<T, R>(path: string, data: T) : Promise<R>;
}

export class Client implements IClient {
  private axiosInstance: AxiosInstance;
  constructor(serverName: string) {
    this.axiosInstance  = axios.create({
      baseURL: "http://api.taxi.com/" + serverName,
      timeout: 1000,
    });
  }

  setToken(token: string) {
    this.axiosInstance.defaults.headers.common["Authorization"] =  `Bearer ${token}`;
  }
  async post<T, R>(path: string, data: T) {
    const response = await this.axiosInstance.post<R>(path, data);
    return response.data;
  }
  async get<R>(path: string) {
    const response = await this.axiosInstance.get<R>(path);
    return response.data;
  }
}
