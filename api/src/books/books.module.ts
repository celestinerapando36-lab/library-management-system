
import { Module } from "@nestjs/common";
import { BooksService } from "./books.service.js";
import { BooksController } from "./books.controller.js";
import { AuthModule } from "../auth/auth.module.js";

@Module({
  imports: [AuthModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
