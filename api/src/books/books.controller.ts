import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { BooksService } from "./books.service.js";

@Controller("books")
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: {
      title: string;
      author: string;
      isbn: string;
      totalCopies: number;
      genreId: number;
    },
  ) {
    return this.booksService.create(body);
  }

  @Post(":id/borrow")
  borrow(@Param("id", ParseIntPipe) id: number) {
    return this.booksService.borrow(id);
  }
}