
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { BooksService } from "./books.service.js";
import { CreateBookDto } from "./dto/create-book.dto.js";
import { UpdateBookDto } from "./dto/update-book.dto.js";

import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { RolesGuard } from "../auth/roles.guard.js";

@UseGuards(JwtAuthGuard)
@Controller("books")
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  findAll(
    @Query("genreId") genreId?: string,
    @Query("search") search?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.booksService.findAll(
      genreId ? Number(genreId) : undefined,
      search,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles("LIBRARIAN")
  @Post()
  create(@Body() body: CreateBookDto) {
    return this.booksService.create(body);
  }

  @UseGuards(RolesGuard)
  @Roles("LIBRARIAN")
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateBookDto,
  ) {
    return this.booksService.update(id, body);
  }

  @UseGuards(RolesGuard)
  @Roles("LIBRARIAN")
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }

  @Post(":id/borrow")
  borrow(@Param("id", ParseIntPipe) id: number) {
    return this.booksService.borrow(id);
  }
}
