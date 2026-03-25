import type { Pool } from 'pg';
import type { NoteRepository } from '../models/interfaces/repository.js';
import type { Note } from '../models/types/note.js';
import NoteMapper from './utils/NoteMapper.js';
import { NotFoundError } from '../services/error/NotFoundError.js';

export class NoteRepo implements NoteRepository {
  dbClient: Pool;
  constructor(pool: Pool) {
    this.dbClient = pool;  
    //binding method penting untuk memastikan konteks method konsisten
    this.createNote = this.createNote.bind(this);
    this.getNotes = this.getNotes.bind(this);
    this.getNotesByUserId = this.getNotesByUserId.bind(this);
    this.getNoteById = this.getNoteById.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }
  async createNote(payload: Note): Promise<string> {
    const query = 'INSERT INTO notes (id, owner_id, title, content, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
    const values = [payload.id, payload.ownerId, payload.title, payload.content, payload.createdAt, payload.updatedAt];
    const result = await this.dbClient.query(query, values);
    const newNoteId = result.rows[0].id;
    return newNoteId;
  }
  async getNotes(): Promise<Note[]> {
    const query = 'SELECT id, owner_id, title, content, created_at, updated_at FROM notes';
    const result = await this.dbClient.query(query);
    return result.rows.map(r => NoteMapper(r));
  }
  async getNotesByUserId(userId: string): Promise<Note[]> {
    const query = 'SELECT id, owner_id, title, content, created_at, updated_at FROM notes WHERE owner_id = $1';
    const values = [userId];
    const result = await this.dbClient.query(query, values);
    return result.rows.map(r=> NoteMapper(r));
  }
  async getNoteById(noteId: string): Promise<Note | null> {
    const query = 'SELECT id, owner_id, title, content, created_at, updated_at  FROM notes WHERE id = $1';
    const values = [noteId];
    const result = await this.dbClient.query(query, values);
    if (result.rows.length === 0) {
      return null; // nanti service cek
    }
    return NoteMapper(result.rows[0]);
  }
  async updateNote(payload: Note): Promise<void> {
    const query = 'UPDATE notes SET title = $1, content = $2, updated_at = $3 WHERE id = $4';
    const values = [payload.title, payload.content, payload.updatedAt, payload.id];
    const result = await this.dbClient.query(query, values);
    if (result.rowCount == 0){
      throw new NotFoundError('Catatan Tidak Ditemukan');
    }
  }
  async deleteNote(noteId: string): Promise<void> {
    const query = 'DELETE FROM notes WHERE id = $1';
    const values = [noteId];
    const result = await this.dbClient.query(query, values);
    if (result.rowCount == 0){
      throw new NotFoundError('Catatan Tidak Ditemukan');
    }
  }
}