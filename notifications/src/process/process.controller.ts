import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class ProcessController {
  @EventPattern('send')
  async create(data: Record<string, unknown>) {
    Logger.log(data, "Response");
  }
}
