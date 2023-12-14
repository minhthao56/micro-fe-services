import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {jwtDecode} from "jwt-decode"
import { AuthProvider } from "./firebase/provider";

interface IClient {
    post<T, R>(path: string, data: T) : Promise<R>;
    get<R>(path: string): Promise<R>;
    put<T, R>(path: string, data: T): Promise<R>;
}

type ClientConstructorProps = {
  baseURL: string;
  authProvider?: AuthProvider;
  path?: string;
}


export class Client implements IClient {
  private baseURL: string;
  private axiosInstance: AxiosInstance;
  private auth?: AuthProvider;

  constructor(props?:ClientConstructorProps) {
    const {baseURL, path, authProvider} = props || {};
    let pathName = path || "";
    let baseURLName = baseURL || "";
    this.axiosInstance  = axios.create({
      baseURL: baseURLName + pathName,
      timeout: 60000,
      params: {},
      headers: {
        // "Content-Type": "application/json",
        // "Accept": "application/json",
      }
    });
    this.baseURL = baseURLName;
    this.auth = authProvider;
  }

  setBaseURL(url: string){
    this.baseURL = url
    this.axiosInstance.defaults.baseURL = url
  }
  setPath(path: string){
    const baseURL = this.axiosInstance.defaults.baseURL || ""
    if (baseURL !== this.baseURL) {
      this.axiosInstance.defaults.baseURL = this.baseURL
    }
    this.axiosInstance.defaults.baseURL = baseURL + path
  }

  setApiKey(key: string, value: string){
    this.axiosInstance.defaults.params[key] = value
  }

  setHeader(key: string, value: string){
    this.axiosInstance.defaults.headers.common[key] = value
  }

  setToken(token: string) {
    this.axiosInstance.defaults.headers.common["Authorization"] =  `Bearer ${token}`;
  }
  setBasicAuth(username: string, password: string) {
    this.axiosInstance.defaults.headers.common["Authorization"] =  'Basic ' + btoa(username + ':' + password)
  }
  async post<T, R>(path: string, data: T) {
    await this.verifyToken();
    const response = await this.axiosInstance.post<R>(path, data);
    return response.data;
  }
  async get<R>(path: string, config?: AxiosRequestConfig) {
    await this.verifyToken();
    const response = await this.axiosInstance.get<R>(path, config);
    return response.data;
  }

  async put<T, R>(path: string, data: T) {
    await this.verifyToken();
    const response = await this.axiosInstance.put<R>(path, data);
    return response.data;
  }

  private async refreshToken() {
    if (this.auth) {
      const token = await this.auth.getUser()?.getIdToken(true);
      if (!token) {
        throw new Error("token is null");
      }
      this.setToken(token);
    }
  }

  private async verifyToken() {
    const token = this.axiosInstance.defaults.headers?.common?.["Authorization"];
    if (token && this.auth) {
      const decodedToken = jwtDecode(token.toString());
      const exp = decodedToken?.exp || 0;
      const now = Date.now() / 1000;
      let seconds = exp - now;
      let minutes = seconds / 60;
      console.log("Token expires in: " + minutes + " minutes");
      
      if (exp - now < 60) {
        console.log("Token is expired, refreshing...");
        await this.refreshToken();
      }
    }
  }
}
