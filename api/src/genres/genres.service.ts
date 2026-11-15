
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  // Retrieve all genres
  findAll() {
    return this.prisma.genre.findMany({
      include: { books: true },
    });
  }

  // Retrieve one genre by ID
  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { books: true },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    return genre;
  }

  // Create a new genre
  async create(data: { name: string; slug: string }) {
    const existingName = await this.prisma.genre.findUnique({
      where: { name: data.name },
    });

    const existingSlug = await this.prisma.genre.findUnique({
      where: { slug: data.slug },
    });

    if (existingName || existingSlug) {
      throw new ConflictException("Genre name or slug already exists");
    }

    return this.prisma.genre.create({ data });
  }

  // Update an existing genre
  async update(id: number, data: { name?: string; slug?: string }) {
    await this.findOne(id);

    if (data.name) {
      const existingName = await this.prisma.genre.findUnique({
        where: { name: data.name },
      });

      if (existingName && existingName.id !== id) {
        throw new ConflictException("Genre name already exists");
      }
    }

    if (data.slug) {
      const existingSlug = await this.prisma.genre.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictException("Genre slug already exists");
      }
    }

    return this.prisma.genre.update({
      where: { id },
      data,
    });
  }

  // Delete an existing genre
  async remove(id: number) {
    const genre = await this.findOne(id);

    if (genre.books.length > 0) {
      throw new ConflictException(
        "Cannot delete a genre that still has books",
      );
    }

    return this.prisma.genre.delete({
      where: { id },
    });
  }
}
