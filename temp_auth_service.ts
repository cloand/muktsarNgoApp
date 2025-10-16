import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { DonorsService } from '../donors/donors.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterDonorDto } from './dto/register-donor.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private donorsService: DonorsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    
    const user = await this.usersService.create({
      ...registerDto,
      passwordHash: hashedPassword,
    });

    const { passwordHash, ...result } = user;
    return result;
  }

  async registerDonor(registerDonorDto: RegisterDonorDto) {
    try {
      // Check if user with email already exists
      const existingUser = await this.usersService.findByEmail(registerDonorDto.email);
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      // Create user account with DONOR role
      const hashedPassword = await bcrypt.hash(registerDonorDto.password, 12);
      const user = await this.usersService.create({
        email: registerDonorDto.email,
        passwordHash: hashedPassword,
        firstName: registerDonorDto.firstName,
        lastName: registerDonorDto.lastName,
        role: 'DONOR',
      });

      // Create donor profile
      const { password, firstName, lastName, ...donorData } = registerDonorDto;
      const donor = await this.donorsService.create({
        ...donorData,
        name: `${firstName} ${lastName}`,
      });

      // Generate JWT token
      const payload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        donor: donor.data,
        message: 'Donor registered successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to register donor');
    }
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { passwordHash, ...result } = user;
    return result;
  }
}
