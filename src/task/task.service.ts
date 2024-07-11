import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TaskDto } from './dto/task.dto';


@Injectable()
export class TaskService {

    constructor(private prisma: PrismaService) { }

    async getAll(userId: string) {
        return this.prisma.task.findMany({
            where: {
                userId,
            },
        });
    };

    async create(dto: TaskDto, userId: string) {
        return this.prisma.task.create({
            data: {
                name: dto.name,
                isCompleted: dto.isCompleted,
                createdAt: dto.createdAt,
                priority: dto.priority,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    };

    async update(dto: Partial<TaskDto>, taskId: string, userId: string) { // Partial указывает, что все поля будут опциональными
        return this.prisma.task.update({
            where: {
                userId,
                id: taskId
            },
            data: dto,
        });
    };

    async delete(taskId: string) {
        return this.prisma.task.delete({
            where: {
                id: taskId
            },
        });
    };

}
