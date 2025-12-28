import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { Token, User } from './decorators';
import { SignInDto, SignUpDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import type { CurrentUser } from './interfaces/current-user.interface';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.client.send('auth.sign.up', signUpDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.client.send('auth.sign.in', signInDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('verify-token')
  verifyToken(@User() user: CurrentUser, @Token() token: string) {
    return { user, token };
  }
}
