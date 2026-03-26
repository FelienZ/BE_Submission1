import { randomUUID } from 'node:crypto';
import type { NoteService } from '../models/interfaces/services.js';
import type { Note, NoteRequest, UpdateNoteRequest } from '../models/types/note.js';
import type { NoteRepo } from '../repo/NoteRepo.js';
import { ErrorDBTranslator } from './error/ErrorTranslator.js';
import { DomainError } from './error/DomainError.js';

export class NoteServices implements NoteService {
  noteRepo: NoteRepo;
  constructor(noteRepo: NoteRepo) {
    this.noteRepo = noteRepo;

    this.createNote = this.createNote.bind(this);
    this.getNotes = this.getNotes.bind(this);
    this.getNotesByUserId = this.getNotesByUserId.bind(this);
    this.getNoteById = this.getNoteById.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }
  async createNote(payload: NoteRequest): Promise<string> {
    const newNote: Note = {
      ...payload,
      id: randomUUID().toString(),
      ownerId: payload.ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const noteId = await this.noteRepo.createNote(newNote).catch(err => {
      throw ErrorDBTranslator(err);
    });
    return noteId;
  }
  async getNotes(): Promise<Note[]> {
    const notes = await this.noteRepo.getNotes();
    return notes;
  }
  async getNotesByUserId(userId: string): Promise<Note[]> {
    const notes = await this.noteRepo.getNotesByUserId(userId).catch(err => {
      throw ErrorDBTranslator(err);
    });
    return notes;
  }
  async getNoteById(noteId: string): Promise<Note> {
    const note = await this.noteRepo.getNoteById(noteId).catch(err => {
      throw ErrorDBTranslator(err);
    });
    if (!note) {
      throw new DomainError('Catatan tidak ditemukan', 404);
    }
    return note;
  }
  async updateNote(id: string, payload: NoteRequest): Promise<void> {
    const newNote: UpdateNoteRequest = {
      title : payload.title,
      content: payload.content,
      updatedAt: new Date(),
    };
    await this.noteRepo.updateNote(id, newNote).catch(err => {
      throw ErrorDBTranslator(err);
    });
  }
  async deleteNote(noteId: string): Promise<void> {
    await this.noteRepo.deleteNote(noteId).catch(err => {
      throw ErrorDBTranslator(err);
    });
  }   
}