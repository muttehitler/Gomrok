import { Injectable } from '@nestjs/common';

@Injectable()
export class PanelService {
  getHello(): string {
    return 'Hello World!';
  }
}
