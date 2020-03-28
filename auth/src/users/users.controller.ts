import {
  Controller,
  Post,
  HttpStatus,
  Body,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { getOperationId } from 'src/shared/utils';
import { UsersService } from './users.service';
import { UserDTO, RegisterUserDTO } from './DTO';

@ApiTags('auth')
@Controller('auth')
export class UsersController {
  private logger = new Logger('User');
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  @ApiResponse({ status: HttpStatus.CREATED, type: UserDTO })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  @ApiOperation(getOperationId('User', 'Register'))
  async registerClient(@Body() registerDTO: RegisterUserDTO): Promise<UserDTO> {
    const { email } = registerDTO;

    let exist;
    try {
      exist = await this.userService.findOneByEmail(email);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error while creating a user');
    }

    if (exist) {
      throw new BadRequestException(`${email} already exists`);
    }

    const newUser = await this.userService.register(registerDTO);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { username, firstName, lastName, birthDate } = newUser;
    return { email, username, firstName, lastName, birthDate };
  }
}
