import express from 'express';
import { NoteHandler } from '../controllers/NoteHandler.js';

const router = express.Router();

export const NoteRoutes = (noteHandler: NoteHandler) => {
  router.get('/', (_, res) => noteHandler.getNotes(res));
  router.get('/user/:userId', (req, res) => noteHandler.getNotesByUserId(req, res));
  router.get('/:noteId', (req, res) => noteHandler.getNoteById(req, res));
  router.post('/', (req, res) => noteHandler.createNote(req, res));
  router.put('/:noteId', (req, res) => noteHandler.updateNote(req, res));
  router.delete('/:noteId', (req, res) => noteHandler.deleteNote(req, res));
  return router;
};