import type { Request, Response } from 'express';
import type { UserService } from '../models/interfaces/services.js';
import type { UserRequest, UserResponse } from '../models/types/user.js';
import type { wrappedResponse } from '../models/interfaces/apiResponse.js';

export class UserHandler {
  userService: UserService;
  constructor( userService: UserService) {
    this.userService = userService;
        
    this.createUser = this.createUser.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.getUserByEmail = this.getUserByEmail.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }
  async createUser(req: Request, res: wrappedResponse<{id: string}>): Promise<Response> {
    try {
      const payload: UserRequest = req.body;
      const userId = await this.userService.createUser(payload);
      return res.status(201).json({ data: {id: userId}, message: 'success created user' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(500).json({ message: errorMessage });
    }
  }
  async getUserById(req: Request, res: wrappedResponse<UserResponse>): Promise<Response> {
    try {
      const userId = String(req.params.userId);
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({data: user, message: 'success get user by id'});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(500).json({ message: errorMessage});
    }
  }
  async getUserByEmail(req: Request, res: wrappedResponse<UserResponse>): Promise<Response> {
    try {
      const email = String(req.body.email);
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({data: user, message: 'success get user by email'});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(500).json({ message: errorMessage });
    }
  }
  async updateUser(req: Request, res: wrappedResponse): Promise<Response> {
    try {
      const payload: UserRequest = req.body;
      const id = String(req.params.userId);
      await this.userService.updateUser(id, payload);
      return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(500).json({ message: errorMessage });
    }
  }
  async deleteUser(req: Request, res: wrappedResponse): Promise<Response> {
    try {
      const userId = String(req.params.userId);
      await this.userService.deleteUser(userId);
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(500).json({ message: errorMessage });
    }
  }

}