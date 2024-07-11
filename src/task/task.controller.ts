import { Controller, Get, HttpCode, Post, UsePipes, ValidationPipe, Body, Param, Put, Delete } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorators';
import { TaskDto } from './dto/task.dto';
import { TaskService } from './task.service';

@Controller('user/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Get()
  @Auth()
  async getAll(@CurrentUser('id') userId: string) {
    return this.taskService.getAll(userId);
  };

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async create(@Body() dto: TaskDto, @CurrentUser('id') userId: string) {
    return this.taskService.create(dto, userId);
  };

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id') // выбираем id из строки запроса
  @Auth()
  async update(@Body() dto: TaskDto, @CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.taskService.update(dto, id, userId);
  };

  @HttpCode(200)
  @Delete(':id') // выбираем id из строки запроса
  @Auth()
  async delete(@Param('id') id: string) {
    return this.taskService.delete(id);
  }
}


