import express from "express";
import Note from "../models/Note";
import NoteHistory from "../models/NoteHistory";
import User from "../models/User";
import Collaboration from "../models/Collaboration";
import { Op } from "@sequelize/core";

const router = express.Router();

// Create a Note
router.post("/notes", async (req, res) => {
  if (!res.locals.user?.id) {
    res.statusCode = 403;
    throw new Error("Missing Tokens");
  }
  const { title, description } = req.body;
  const note = await Note.create({
    title,
    description,
    createdBy: res.locals.user.id,
  });
  res.json(note);
});

// Get Notes
router.get("/notes", async (req, res) => {
  if (!res.locals.user?.id) {
    res.statusCode = 403;
    throw new Error("Missing Tokens");
  }
  const notes = await Note.findAll({ include: User });
  const collaborators = await Collaboration.findOne({
    where: {
      userId: parseInt(res.locals.user.id),
      noteId: { [Op.in]: notes.filter((note) => note.id) },
    },
  });
  if (!collaborators) {
    res.statusCode = 403;
    throw new Error("You don't have the permission to read this Note");
  }
  res.json(notes);
});

// Get Specific Note
router.get("/notes/:id", async (req, res) => {
  const noteId = req.params.id;
  const note = await Note.findByPk(noteId);
  if (!note) {
    res.statusCode = 404;
    throw new Error("Note not found");
  }
  res.json(note);
});

// Update a Note
router.put("/notes/:id", async (req, res) => {
  const noteId = req.params.id;
  const { title, description } = req.body;

  const note = await Note.findByPk(noteId);
  if (!note) {
    res.statusCode = 404;
    throw new Error("Note not found");
  }

  // Create history before updating
  const history = await NoteHistory.create({
    noteId: note.id,
    changedBy: req.body.changedBy,
    prevTitle: note.title,
    prevDescription: note.description,
    newTitle: title,
    newDescription: description,
  });

  await note.update({ title, description });
  res.json(note);
});

// Delete a Note
router.delete("/notes/:id", async (req, res) => {
  const noteId = req.params.id;
  await Note.destroy({ where: { id: noteId } });
  res.send("Note deleted");
});

// Get Collaborators for a Note
router.get("/notes/:id/collaborators", async (req, res) => {
  const noteId = req.params.id;
  const collaborators = await Collaboration.findAll({
    where: { noteId },
    include: User,
  });
  res.json(collaborators);
});

export default router;
