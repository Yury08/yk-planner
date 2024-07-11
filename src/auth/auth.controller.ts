import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe, Res, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UsePipes(new ValidationPipe()) // чтобы срабатывала валидация
  @HttpCode(200)
  @Post('login')
  // { passthrough: true } - чтобы cookie привязывались
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) { // @Body() - тело запроса
    const { refreshToken, ...response } = await this.authService.login(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  };

  @UsePipes(new ValidationPipe()) // чтобы срабатывала валидация
  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) { // @Body() - тело запроса
    const { refreshToken, ...response } = await this.authService.register(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  };

  @HttpCode(200)
  @Post('login/access-token')
  async getNewTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshTokenFromCookies = req.cookies[this.authService.REFRESH_TOKEN_NAME];

    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokenToResponse(res);
      throw new UnauthorizedException("Refresh token not passed");
    };

    const { refreshToken, ...response } = await this.authService.getNewTokens(refreshTokenFromCookies);

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response

  };


  @HttpCode(200)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenToResponse(res);
    return true;
  };

}
