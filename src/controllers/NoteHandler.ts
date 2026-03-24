import type { Request, Response } from 'express';
import type { NoteService } from '../models/interfaces/services.js';
import type { Note, NoteRequest } from '../models/types/note.js';
import type { wrappedResponse } from '../models/interfaces/apiResponse.js';
import { DomainError } from '../services/error/DomainError.js';

export class NoteHandler {
  noteService: NoteService;
  constructor(noteService: NoteService) {
    this.noteService = noteService;

    this.createNote = this.createNote.bind(this);
    this.getNotes = this.getNotes.bind(this);
    this.getNotesByUserId = this.getNotesByUserId.bind(this);
    this.getNoteById = this.getNoteById.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }
  async createNote(req: Request, res: wrappedResponse<{id: string}>): Promise<Response> {
    try {
      const payload: NoteRequest = req.body;
      const noteId = await this.noteService.createNote(payload);
      return res.status(201).json({ data: {id: noteId}  , message: 'Success created note'});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error'; // ambil dari return service
      return res.status(error instanceof DomainError ? error.statusCode : 500).json({ message: errorMessage});
    }
  }
  async getNotes(res: wrappedResponse<Note[]>): Promise<Response> {
    try {
      const notes = await this.noteService.getNotes();
      return res.status(200).json({data:notes, message: 'success get notes'});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(error instanceof DomainError ? error.statusCode : 500).json({ message: errorMessage});
    }
  }
  async getNotesByUserId(req: Request, res: wrappedResponse<Note[]>): Promise<Response> {
    try {
      const userId = String(req.params.userId);
      const notes = await this.noteService.getNotesByUserId(userId);
      return res.status(200).json({data: notes, message: 'success Get user notes'});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(error instanceof DomainError ? error.statusCode : 500).json({ message: errorMessage });
    }
  }
  async getNoteById(req: Request, res: wrappedResponse<Note>): Promise<Response> {
    try {
      const noteId = String(req.params.noteId);
      const note = await this.noteService.getNoteById(noteId);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      return res.status(200).json({data: note, message: 'success get note by id'});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(error instanceof DomainError ? error.statusCode : 500).json({ message: errorMessage });
    }
  }
  async updateNote(req: Request, res: wrappedResponse): Promise<Response> {
    try {
      const noteId = String(req.params.noteId);
      const payload: NoteRequest = req.body;
      await this.noteService.updateNote(noteId, payload);
      return res.status(200).json({ message: 'Note updated successfully' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(error instanceof DomainError ? error.statusCode : 500).json({ message: errorMessage});
    }
  }
  async deleteNote(req: Request, res: wrappedResponse): Promise<Response> {
    try {
      const noteId = String(req.params.noteId);
      await this.noteService.deleteNote(noteId);
      return res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(error instanceof DomainError ? error.statusCode : 500).json({ message: errorMessage });
    }
  }
}