import {
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  Body,
  HttpCode,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from '../users';
import { AppRequest } from '../shared';
import { LocalAuthGuard } from './guards';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() userDto: RegisterUserDto) {
    const user = await this.usersService.findByName(userDto.name);
    if (user) {
      throw new BadRequestException('User with such name already exists');
    }
    return this.usersService.create({
      name: userDto.name,
      password: userDto.password,
      email: userDto.email,
    });
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Request() req: AppRequest) {
    if (!req.user) {
      throw new BadRequestException();
    }

    const token = this.authService.generateToken(req.user, 'basic');

    return token;
  }
}
