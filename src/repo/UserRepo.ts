import type { Pool } from 'pg';
import type { UserRepository } from '../models/interfaces/repository.js';
import type { User } from '../models/types/user.js';
import UserMapper from './utils/UserMapper.js';
import { NotFoundError } from '../services/error/NotFoundError.js';

export class UserRepo implements UserRepository {
  dbClient: Pool;
  constructor(pool: Pool) {
    this.dbClient = pool;
    this.createUser = this.createUser.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.getUserByEmail = this.getUserByEmail.bind(this);
  }
  async createUser(payload: User): Promise<string> {
    const query = 'INSERT INTO users (id, user_name, email, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
    const values = [payload.id, payload.name, payload.email, payload.password, payload.createdAt, payload.updatedAt];
    const result =await this.dbClient.query(query, values);
    const newUserId = result.rows[0].id;
    return newUserId;
  }
  async getUserById(userId: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [userId];
    const result = await this.dbClient.query(query, values);
    if (result.rows.length == 0){
      return null;
    }
    return UserMapper(result.rows[0]);
  }
  async getUserByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await this.dbClient.query(query, values);
    if (result.rows.length == 0){
      return null;
    }
    return UserMapper(result.rows[0]);
  }
  async updateUser( payload: User): Promise<void> {
    const query = 'UPDATE users SET user_name = $1, email = $2, password = $3, updated_at = $4 WHERE id = $5';
    const values = [payload.name, payload.email, payload.password, payload.updatedAt, payload.id];
    const result = await this.dbClient.query(query, values);
    if (result.rowCount == 0){
      throw new NotFoundError('User Tidak Ditemukan');
    }
  }
  async deleteUser(userId: string): Promise<void> {
    const query = 'DELETE FROM users WHERE id = $1';
    const values = [userId];
    const result = await this.dbClient.query(query, values);
    if (result.rowCount == 0){
      throw new NotFoundError('User Tidak Ditemukan');
    }
  }
}