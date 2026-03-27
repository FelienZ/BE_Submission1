import type { Pool } from 'pg';
import type { UserRepository } from '../models/interfaces/repository.js';
import type { UpdateUserRequest, User } from '../models/types/user.js';
import UserMapper from './utils/UserMapper.js';

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
  async updateUser(id: string, payload: UpdateUserRequest): Promise<boolean> {
    const query: string[] = [];
    const values: (string | Date)[] = [id];
    if(payload.email && payload.email.trim() !== ''){
      query.push(`email = $${values.length + 1}`);
      values.push(payload.email);
    }
    if(payload.name && payload.name.trim() !== ''){
      query.push(`user_name = $${values.length + 1}`);
      values.push(payload.name);
    }
    if(payload.password && payload.password.trim() !== ''){
      query.push(`password = $${values.length + 1}`);
      values.push(payload.password);
    }
    if(query.length == 0){
      return false;
    }
    if(payload.updatedAt){
      query.push(`updated_at = $${values.length + 1}`);
      values.push(payload.updatedAt);
    }else{
      query.push(`updated_at = $${values.length + 1}`);
      values.push(new Date());
    }
    const queryString = `UPDATE users SET ${query.join(', ')} WHERE id = $1`;
    const result = await this.dbClient.query(queryString,values);
    return Number(result.rowCount )> 0;
  }
  async deleteUser(userId: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const values = [userId];
    const result = await this.dbClient.query(query, values);
    return Number(result.rowCount )> 0;
  }
}