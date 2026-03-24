import express from 'express';
import { UserHandler } from '../controllers/UserHandler.js';

const router = express.Router();

export const UserRoutes = (userHandler: UserHandler) => {
  router.post('/', (req, res) => userHandler.createUser(req, res));
  router.get('/:userId', (req, res) => userHandler.getUserById(req, res));
  router.get('/email', (req, res) => userHandler.getUserByEmail(req, res)); // via body
  router.put('/:userId', (req, res) => userHandler.updateUser(req, res));
  router.delete('/:userId', (req, res) => userHandler.deleteUser(req, res));
  return router;
};