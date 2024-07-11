import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')
	app.use(cookieParser())
	app.enableCors({
		origin: ['https://yury08.github.io/yk-planner-client/'],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})

	await app.listen(5555)
}
bootstrap()
