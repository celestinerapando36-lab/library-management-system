import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.book.findMany({ include: { genre: true } });
  }

  findOne(id: number) {
    return this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
  }

  create(data: {
    title: string;
    author: string;
    isbn: string;
    totalCopies: number;
    genreId: number;
  }) {
    return this.prisma.book.create({
      data: { ...data, availableCopies: data.totalCopies },
    });
  }

  async borrow(id: number) {
    const result = await this.prisma.book.updateMany({
      where: { id, availableCopies: { gt: 0 } },
      data: { availableCopies: { decrement: 1 } },
    });
    if (result.count === 0) {
      throw new BadRequestException("No copies available");
    }
    return this.findOne(id);
  }
}