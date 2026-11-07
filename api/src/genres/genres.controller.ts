import { Body, Controller, Get, Post } from "@nestjs/common";
import { GenresService } from "./genres.service.js";

@Controller("genres")
export class GenresController {
  constructor(private genresService: GenresService) {}

  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; slug: string }) {
    return this.genresService.create(body);
  }
}