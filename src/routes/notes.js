import express from 'express';

const router = express.Router();

const notes = [
  { id: '1', title: 'First note' },
  { id: '2', title: 'Second note' },
];

// GET /notes
router.get('/', (req, res) => {
  res.json(notes);
});

// GET /notes/:noteId
router.get('/:noteId', (req, res) => {
  const note = notes.find((n) => n.id === req.params.noteId);

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  res.json(note);
});

export default router;
