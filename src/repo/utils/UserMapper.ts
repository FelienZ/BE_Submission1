import type { QueryResultRow } from 'pg';
import type { User } from '../../models/types/user.js';

export default function UserMapper(row: QueryResultRow): User {
  return {
    id: row.id,
    name: row.user_name,
    email: row.email,
    password: row.password,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}