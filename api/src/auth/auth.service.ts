
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service.js";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto.js";
import { LoginDto } from "./dto/login.dto.js";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // USER REGISTRATION
  async register(registerDto: RegisterDto) {
    // 1. Check whether the email is already registered
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException("Email is already registered");
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      10,
    );

    // 3. Create the new user
    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // 4. Generate JWT access token
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // 5. Return user details and token
    return {
      message: "User registered successfully",
      access_token: accessToken,
      user,
    };
  }

  // USER LOGIN
  async login(loginDto: LoginDto) {
    // 1. Find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        "Invalid email or password",
      );
    }

    // 2. Compare submitted password with hashed password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        "Invalid email or password",
      );
    }

    // 3. Generate JWT access token
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // 4. Remove password from returned user details
    const { password, ...userDetails } = user;

    // 5. Return user details and token
    return {
      message: "Login successful",
      access_token: accessToken,
      user: userDetails,
    };
  }
}
