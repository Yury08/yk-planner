import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt.guards";

// проверяет авторизацию
export const Auth = () => UseGuards(JwtAuthGuard);