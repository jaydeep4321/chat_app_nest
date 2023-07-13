import {
  Controller,
  Body,
  Post,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { ResponseDto } from 'src/utils/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Res() res) {
    const response = await this.authService.login(req.user);

    console.log(response);
    res.cookie('jwt', response.token);
    return new ResponseDto().sendSuccess('success', response, res);
  }

  @Post('signup')
  async signUp(@Body() user: User) {
    return await this.authService.create(user);
  }
}
