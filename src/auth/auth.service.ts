import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/services/users.service';
import { User } from '../users/models/user';

type TokenResponse = {
  token_type: string;
  access_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(name: string, password: string) {
    const user = await this.usersService.findByName(name);
    if (user) return user;
    return this.usersService.create({ name, password });
  }

  generateToken(user: User, type?: 'jwt' | 'basic'): TokenResponse {
    const generators = {
      jwt: this.generateJwtToken,
      basic: this.generateBasicToken,
    };
    const generate = generators[type ?? 'jwt'];

    return generate(user);
  }

  private generateJwtToken(user: User): TokenResponse {
    const payload = { username: user.name, sub: user.id };

    return {
      token_type: 'Bearer',
      access_token: this.jwtService.sign(payload),
    };
  }

  private generateBasicToken(user: User): TokenResponse {
    function encodeUserToken(user: User) {
      const { name, password } = user;
      const buf = Buffer.from([name, password].join(':'), 'utf8');

      return buf.toString('base64');
    }

    return {
      token_type: 'Basic',
      access_token: encodeUserToken(user),
    };
  }
}
