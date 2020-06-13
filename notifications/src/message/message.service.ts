import { Injectable, OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { VerificationNotificationDTO } from './message.dto';

@Injectable()
export class MessageService implements OnModuleInit {
  constructor(
    @Inject('VERIFICATION_CLIENT') private readonly client: ClientProxy,
  ) {}

  onModuleInit() {
    this.client.connect();
  }

  send(verificationDTO: VerificationNotificationDTO) {
    return this.client.emit('send', verificationDTO).toPromise();
  }
}
