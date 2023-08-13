import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  async getHello(): Promise<string> {
    try {
      const a = await this.httpService.axiosRef.get(
        'http://usermgmt-service:9090/usermgmt',
      );
      return JSON.stringify(a.data);
    } catch (e) {
      return JSON.stringify(e);
    }
  }
}
