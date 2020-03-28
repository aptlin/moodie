import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoginDTO } from 'src/auth/DTO';
import { IsNotEmpty, MinLength } from 'class-validator';

export class UserDTO {
  @ApiProperty() email: string;
  @ApiProperty() username: string;
  @ApiPropertyOptional() firstName?: string;
  @ApiPropertyOptional() lastName?: string;
  @ApiPropertyOptional() birthDate?: Date;
}

export class RegisterUserDTO extends LoginDTO {
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(4, { message: 'Username is too short.' })
  @ApiProperty({ default: 'tester' })
  username: string;

  @ApiProperty() firstName?: string;
  @ApiProperty() lastName?: string;
  @ApiProperty()
  birthDate?: Date;
}
