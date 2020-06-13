// import {
//   ApiProperty,
//   ApiPropertyOptional,
//   ApiResponseProperty,
// } from '@nestjs/swagger';

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class VerificationNotificationDTO {
  @ApiProperty({ example: 'ray@moodie.sdll.io' })
  @IsEmail({}, { message: 'Email is invalid' })
  readonly email: string;
}

export class VerificationNotificationResponseDTO {}
