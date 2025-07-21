import { Controller,Get, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AuthGuard } from "./guards/auth.guard";
import { AppService } from "./app.service";
import { Roles } from './guards/roles.decorator';

@UseGuards(AuthGuard)
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(@Req() request: Request): string {
        return this.appService.getHello();
    }

    @Get('protected')
    @Roles('doc')
    getProtected(@Req() request: Request): string {
        return this.appService.getProtected();
    }
}