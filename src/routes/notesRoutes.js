import { Router } from 'express';
import { celebrate } from 'celebrate';

import { authenticate } from '../middleware/authenticate.js';

import {
  createNoteSchema,
  getAllNotesSchema,
  noteIdSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

const router = Router();

router.use(authenticate);

router.get('/', celebrate(getAllNotesSchema), getAllNotes);

router.get('/:noteId', celebrate(noteIdSchema), getNoteById);

router.post('/', celebrate(createNoteSchema), createNote);

router.patch('/:noteId', celebrate(updateNoteSchema), updateNote);

router.delete('/:noteId', celebrate(noteIdSchema), deleteNote);

export default router;
