
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MinLength,
  MaxLength,
} from "class-validator";

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  author: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(20)
  isbn: string;

  @IsInt()
  @Min(1)
  totalCopies: number;

  @IsInt()
  @Min(1)
  genreId: number;
}
