import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorators'
import { TimeBlockDto } from './dto/time-block.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { TimeBlockService } from './time-block.service'

@Controller('user/time-blocks')
export class TimeBlockController {
	constructor(private readonly timeBlockService: TimeBlockService) {}

	@Get()
	@Auth()
	async getAll(@CurrentUser('id') userId: string) {
		return this.timeBlockService.getAll(userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(@Body() dto: TimeBlockDto, @CurrentUser('id') userId: string) {
		return this.timeBlockService.create(dto, userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('update-order')
	@Auth()
	updateOrder(@Body() dto: UpdateOrderDto) {
		return this.timeBlockService.updateOrder(dto.ids)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id') // выбираем id из строки запроса
	@Auth()
	async update(
		@Body() dto: TimeBlockDto,
		@CurrentUser('id') userId: string,
		@Param('id') id: string
	) {
		return this.timeBlockService.update(dto, id, userId)
	}

	@HttpCode(200)
	@Delete(':id') // выбираем id из строки запроса
	@Auth()
	async delete(@Param('id') id: string) {
		return this.timeBlockService.delete(id)
	}
}
