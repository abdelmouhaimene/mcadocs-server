import { Controller,Get, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AuthGuard } from "./guards/auth.guard";
import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(@Req() request: Request): string {
        return this.appService.getHello();
    }

    @Get('protected')
    @UseGuards(AuthGuard)
    getProtected(@Req() request: Request): string {
        return this.appService.getProtected();
    }
}