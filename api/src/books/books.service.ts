import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  findAll(
    genreId?: number,
    search?: string,
    page = 1,
    limit = 10,
  ) {
    const where = {
      ...(genreId !== undefined ? { genreId } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { author: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const skip = (page - 1) * limit;

    return this.prisma.book.findMany({
      where,
      skip,
      take: limit,
      include: { genre: true },
    });
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

  // Update an existing book
  async update(
    id: number,
    data: {
      title?: string;
      author?: string;
      isbn?: string;
      totalCopies?: number;
      genreId?: number;
    },
  ) {
    const book = await this.findOne(id);

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return this.prisma.book.update({
      where: { id },
      data,
      include: { genre: true },
    });
  }

  // Delete an existing book
  async remove(id: number) {
    const book = await this.findOne(id);

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return this.prisma.book.delete({
      where: { id },
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