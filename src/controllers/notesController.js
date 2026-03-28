import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);

    const skip = (pageNumber - 1) * perPageNumber;

    let notesQuery = Note.find().where('userId').equals(req.user._id);
    let countQuery = Note.countDocuments().where('userId').equals(req.user._id);

    if (tag) {
      notesQuery = notesQuery.where('tags').equals(tag);
      countQuery = countQuery.where('tags').equals(tag);
    }

    if (search) {
      notesQuery = notesQuery.find({ $text: { $search: search } });
      countQuery = countQuery.find({ $text: { $search: search } });
    }

    notesQuery = notesQuery.skip(skip).limit(perPageNumber);

    const [notes, totalNotes] = await Promise.all([notesQuery, countQuery]);

    const totalPages = Math.ceil(totalNotes / perPageNumber);

    res.status(200).json({
      page: pageNumber,
      perPage: perPageNumber,
      totalPages,
      totalNotes,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOne({
      _id: noteId,
      userId: req.user._id,
    });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId: req.user._id },
      req.body,
      { new: true },
    );

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndDelete({
      _id: noteId,
      userId: req.user._id,
    });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};
