import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2' // библиотке для паролей
import { Response } from 'express'
import { UserService } from '../user/user.service'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	REFRESH_TOKEN_NAME = 'refreshToken'
	EXPIRES_DAY_REFRESH_TOKEN = 1

	constructor(
		private jwt: JwtService,
		private userService: UserService
	) {}

	async login(dto: AuthDto) {
		const { password, ...user } = await this.validateUser(dto)
		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	async register(dto: AuthDto) {
		const oldUser = await this.userService.getByEmail(dto.email)
		if (oldUser) throw new BadRequestException('User already exists')

		const { password, ...user } = await this.userService.create(dto)
		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	async getNewTokens(refreshToken: string) {
		const res = await this.jwt.verifyAsync(refreshToken)
		if (!res) throw new UnauthorizedException('Invalid refresh token')

		const { password, ...user } = await this.userService.getById(res.id)

		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	private issueTokens(userId: string) {
		const data = { id: userId } // записываем userId внутрь токена

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email)

		if (!user) throw new NotFoundException('User not found')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new UnauthorizedException('Invalid password')

		return user
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRES_DAY_REFRESH_TOKEN)
		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: 'localhost',
			expires: expiresIn,
			secure: true,
			// lax if prod
			sameSite: 'none'
		})
	}

	removeRefreshTokenToResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: 'localhost',
			expires: new Date(0),
			secure: true,
			// lax if prod
			sameSite: 'none'
		})
	}
}
