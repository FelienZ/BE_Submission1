import type { Pool } from 'pg';
import type { NoteRepository } from '../models/interfaces/repository.js';
import type { Note } from '../models/types/note.js';
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
    try {
      const result = await this.dbClient.query(query, values);
      const newNoteId = result.rows[0].id;
      return newNoteId;
    } catch (error) {
      throw new Error('Failed to create note', {cause: error});
    }
  }
  async getNotes(): Promise<Note[]> {
    try {
      const query = 'SELECT * FROM notes';
      const result = await this.dbClient.query(query);
      return result.rows.map(r => NoteMapper(r));
    } catch (error) {
      throw new Error('Failed to get notes', {cause: error});
    }
  }
  async getNotesByUserId(userId: string): Promise<Note[]> {
    try {
      const query = 'SELECT * FROM notes WHERE owner_id = $1';
      const values = [userId];
      const result = await this.dbClient.query(query, values);
      return result.rows.map(r=> NoteMapper(r));
    } catch (error) {
      throw new Error('Failed to get notes by user ID', {cause: error});
    }
  }
  async getNoteById(noteId: string): Promise<Note | null> {
    try {
      const query = 'SELECT * FROM notes WHERE id = $1';
      const values = [noteId];
      const result = await this.dbClient.query(query, values);
      if (result.rows.length === 0) {
        return null; // nanti service cek
      }
      return NoteMapper(result.rows[0]);
    } catch (error) {
      throw new Error('Failed to get note by ID', {cause: error});
    }
  }
  async updateNote(payload: Note): Promise<void> {
    try {
      const query = 'UPDATE notes SET title = $1, content = $2, updated_at = $3 WHERE id = $4';
      const values = [payload.title, payload.content, payload.updatedAt, payload.id];
      await this.dbClient.query(query, values);
    } catch (error) {
      throw new Error('Failed to update note', {cause: error});
    }
  }
  async deleteNote(noteId: string): Promise<void> {
    try {
      const query = 'DELETE FROM notes WHERE id = $1';
      const values = [noteId];
      await this.dbClient.query(query, values);
    } catch (error) {
      throw new Error('Failed to delete note', {cause: error});
    }
  }
}