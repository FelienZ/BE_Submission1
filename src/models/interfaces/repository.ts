import type { Pool } from 'pg';
import type { Loggers } from '../types/logs.js';
import type { Note } from '../types/note.js';
import type { User } from '../types/user.js';

interface NoteRepository {
    dbClient: Pool;
    createNote: (payload: Note) => Promise<string>;
    getNotes: () => Promise<Note[]>;
    getNotesByUserId: (userId: string) => Promise<Note[]>;
    getNoteById: (noteId: string) => Promise<Note | null>;
    updateNote: (payload: Note) => Promise<void>;
    deleteNote: (noteId: string) => Promise<void>;
}

interface UserRepository {
    dbClient: Pool;
    createUser: (payload:   User) => Promise<string>;
    getUserById: (userId: string) => Promise<User | null>;
    getUserByEmail: (email: string) => Promise<User | null>;
}

interface LoggerRepository {
    dbclient: Pool;
    logAction: (payload: Loggers) => Promise<void>;
}

export type { NoteRepository, UserRepository, LoggerRepository };