import type { Pool } from 'pg';
import type { Loggers } from '../types/logs.js';
import type { Note, UpdateNoteRequest } from '../types/note.js';
import type { UpdateUserRequest, User } from '../types/user.js';

interface NoteRepository {
    dbClient: Pool;
    createNote: (payload: Note) => Promise<string>;
    getNotes: () => Promise<Note[]>;
    getNotesByUserId: (userId: string) => Promise<Note[]>;
    getNoteById: (noteId: string) => Promise<Note | null>;
    updateNote: (noteId: string, payload: UpdateNoteRequest) => Promise<boolean>;
    deleteNote: (noteId: string) => Promise<boolean>;
}

interface UserRepository {
    dbClient: Pool;
    createUser: (payload:   User) => Promise<string>;
    getUserById: (userId: string) => Promise<User | null>;
    getUserByEmail: (email: string) => Promise<User | null>;
    updateUser: (userId: string, payload: UpdateUserRequest) => Promise<boolean>;
    deleteUser: (userId: string) => Promise<boolean>
}

interface LoggerRepository {
    dbclient: Pool;
    logAction: (payload: Loggers) => Promise<void>;
}

export type { NoteRepository, UserRepository, LoggerRepository };