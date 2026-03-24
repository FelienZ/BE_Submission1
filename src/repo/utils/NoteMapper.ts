import type { QueryResultRow } from 'pg';
import type { Note } from '../../models/types/note.js';

export default function NoteMapper(row: QueryResultRow): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    ownerId: row.owner_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}