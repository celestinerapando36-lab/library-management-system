
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { GenresService } from "./genres.service.js";
import { CreateGenreDto } from "./dto/create-genre.dto.js";
import { UpdateGenreDto } from "./dto/update-genre.dto.js";

@Controller("genres")
export class GenresController {
  constructor(private genresService: GenresService) {}

  // GET /genres
  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  // GET /genres/:id
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.genresService.findOne(id);
  }

  // POST /genres
  @Post()
  create(@Body() body: CreateGenreDto) {
    return this.genresService.create(body);
  }

  // PATCH /genres/:id
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateGenreDto,
  ) {
    return this.genresService.update(id, body);
  }

  // DELETE /genres/:id
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.genresService.remove(id);
  }
}
