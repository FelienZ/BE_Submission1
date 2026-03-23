import type { Note, NoteRequest } from '../types/note.js';
import type {  UserRequest, UserResponse } from '../types/user.js';

//Pakai promise sebagai return value krn query async
interface NoteService {
    createNote: (payload: NoteRequest) => Promise<string>;
    getNotes: () => Promise<Note[]>;
    getNotesByUserId: (userId: string) => Promise<Note[]>;
    getNoteById: (noteId: string) => Promise<Note | null>;
    updateNote: (id: string, payload: NoteRequest) => Promise<void>;
    deleteNote: (noteId: string) => Promise<void>;
}

interface UserService {
    createUser: (payload: UserRequest) => Promise<string>;
    getUserById: (userId: string) => Promise<UserResponse | null>;
    getUserByEmail: (email: string) => Promise<UserResponse | null>; // admin level info
    updateUser: (id: string, payload: UserRequest) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
}

interface LoggerService {
    logAction: (message: string, action: 'CREATE' | 'UPDATE' | 'DELETE', userId: string) => Promise<void>;
}

export type { NoteService, UserService, LoggerService };