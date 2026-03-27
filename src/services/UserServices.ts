import { randomUUID } from 'node:crypto';
import type { UserService } from '../models/interfaces/services.js';
import type { UpdateUserRequest, User, UserRequest, UserResponse } from '../models/types/user.js';
import type { UserRepo } from '../repo/UserRepo.js';
import { ErrorDBTranslator } from './error/ErrorTranslator.js';
import { DomainError } from './error/DomainError.js';
import { NotFoundError } from './error/NotFoundError.js';

export class UserServices implements UserService {
  userRepo: UserRepo;
  constructor(userRepo: UserRepo) {
    this.userRepo = userRepo;

    this.createUser = this.createUser.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.getUserByEmail = this.getUserByEmail.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }
  async createUser(payload: UserRequest): Promise<string> {
    const newUser:User = {
      ...payload,
      id: randomUUID().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const userId = await this.userRepo.createUser(newUser).catch(err => {
      throw ErrorDBTranslator(err);
    });
    return userId;
  }
  async getUserById(userId: string): Promise<UserResponse> {
    const user = await this.userRepo.getUserById(userId).catch(err => {
      throw ErrorDBTranslator(err);
    });
    if (!user){
      throw new DomainError('User tidak ditemukan');
    }
    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email:user.email,
      createdAt: user.createdAt ?? new Date(), // optional, not Null cegah undefined
      updatedAt: user.updatedAt ?? new Date()
    };
    return userResponse;
  }
  async getUserByEmail(email: string): Promise<UserResponse> {
    const user = await this.userRepo.getUserByEmail(email).catch(err => {
      throw ErrorDBTranslator(err);
    });
    if (!user){
      throw new DomainError('User tidak ditemukan');
    }
    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email:user.email,
      createdAt: user.createdAt??new Date(),
      updatedAt: user.updatedAt?? new Date()
    };
    return userResponse;

  }
  async updateUser(id: string, payload: UserRequest): Promise<void> {
    if (!payload.email && !payload.name && !payload.password){
      throw new DomainError('Invalid Payload, Try again with new valid args');
    }
    const newUser: UpdateUserRequest = {
      name:payload.name,
      password: payload.password,
      email: payload.email,
      updatedAt: new Date(),
    };
    const result = await this.userRepo.updateUser(id, newUser).catch(err => {
      throw ErrorDBTranslator(err);
    });
    if (!result){
      throw new NotFoundError('User Tidak ditemukan');
    }
  }
  async deleteUser(userId: string): Promise<void> {
    const result = await this.userRepo.deleteUser(userId);
    if (!result){
      throw new NotFoundError('User Tidak ditemukan');
    }
  }
}