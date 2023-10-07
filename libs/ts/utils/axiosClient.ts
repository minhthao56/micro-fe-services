import axios, { AxiosInstance } from "axios";

interface IClient {
    post<T, R>(path: string, data: T) : Promise<R>;
}

export class Client implements IClient {
  private axiosInstance: AxiosInstance;
  constructor(serverName: string) {
    this.axiosInstance = axios.create({
      baseURL: "http://api.taxi.com/" + serverName,
      timeout: 1000,
    //   headers: { "X-Custom-Header": "foobar" },
    });
  }

  async post<T, R>(path: string, data: T) {
    const response = await this.axiosInstance.post<R>(path, data);
    return response.data;
  }
}
