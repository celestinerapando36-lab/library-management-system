import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.genre.findMany({ include: { books: true } });
  }

  create(data: { name: string; slug: string }) {
    return this.prisma.genre.create({ data });
  }
}