import type { Pool } from 'pg';
import type { NoteRepository } from '../models/interfaces/repository.js';
import type { Note, UpdateNoteRequest } from '../models/types/note.js';
import NoteMapper from './utils/NoteMapper.js';

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
  async updateNote(noteId: string, payload: UpdateNoteRequest): Promise<boolean> {
    const query: string[] = [];
    const values: (string|Date)[] = [noteId];
    if (payload.content && payload.content.trim() !== ''){
      query.push(`content = $${values.length + 1}`);
      values.push(payload.content);
    }
    if (payload.title && payload.title.trim() !== ''){
      query.push(`title = $${values.length + 1}`);
      values.push(payload.title);
    }
    if (query.length == 0){
      return false;// logic polos, no domain
    }
    if (payload.updatedAt){
      query.push(`updated_at = $${values.length + 1}`);
      values.push(payload.updatedAt);
    }else{
      query.push(`updated_at = $${values.length + 1}`);
      values.push(new Date());
    }
    const queryString = `UPDATE notes SET ${query.join(', ')} WHERE id = $1`;
    const result = await this.dbClient.query(queryString, values);
    return Number(result.rowCount )> 0;
  }
  async deleteNote(noteId: string): Promise<boolean> {
    const query = 'DELETE FROM notes WHERE id = $1';
    const values = [noteId];
    const result = await this.dbClient.query(query, values);
    return Number(result.rowCount )> 0;
  }
}