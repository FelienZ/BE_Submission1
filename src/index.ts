import { configDotenv } from 'dotenv';
import express, { type Application } from 'express';
import { NoteRoutes } from './routes/NoteRoutes.js';
import { UserRoutes } from './routes/UserRoutes.js';
import { UserRepo } from './repo/UserRepo.js';
import { DBClient } from './repo/connect.js';
import { UserHandler } from './controllers/UserHandler.js';
import { UserServices } from './services/UserServices.js';
import { NoteRepo } from './repo/NoteRepo.js';
import { NoteServices } from './services/NoteServices.js';
import { NoteHandler } from './controllers/NoteHandler.js';

configDotenv();
const app:Application = express();
const port = Number(process.env.APP_PORT);
const host: string = (process.env.APP_HOST) || 'localhost';

const userRepo: UserRepo = new UserRepo(DBClient);
const userService: UserServices = new UserServices(userRepo);
const userHandler = new UserHandler(userService);

const noteRepo: NoteRepo = new NoteRepo(DBClient);
const noteService: NoteServices = new NoteServices(noteRepo);
const noteHandler = new NoteHandler(noteService);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res)=> res.json({message: 'yoi'}) );
app.use('/api/notes', NoteRoutes(noteHandler));
app.use('/api/users', UserRoutes(userHandler));

app.listen(port, host, ()=>{
  console.log(`Server Run at: http://${host}:${port}`);
});