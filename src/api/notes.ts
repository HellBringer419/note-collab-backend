import express from "express";
import Note from "../models/Note";
import NoteHistory from "../models/NoteHistory";
import User from "../models/User";
import Collaboration from "../models/Collaboration";
import { Op } from "@sequelize/core";

const router = express.Router();

// Create a Note
router.post("/", async (req, res) => {
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
router.get("/", async (req, res) => {
  if (!res.locals.user?.id) {
    res.statusCode = 403;
    throw new Error("Missing Tokens");
  }
  const collaborators = await Collaboration.findAll({
    attributes: ["noteId"],
    where: {
      userId: parseInt(res.locals.user.id),
    },
  });
  const notes = await Note.findAll({
    where: {
      [Op.or]: [
        {
          id: {
            [Op.in]: collaborators.map((c) => c.noteId),
          },
        },
        {
          createdBy: parseInt(res.locals.user.id),
        },
      ],
    },
    include: User,
  });
  res.json(notes);
});

// Get Specific Note
router.get("/:id", async (req, res) => {
  const noteId = req.params.id;
  const note = await Note.findByPk(noteId);
  if (!note) {
    res.statusCode = 404;
    throw new Error("Note not found");
  }
  res.json(note);
});

// Update a Note
router.put("/:id", async (req, res) => {
  if (!res.locals.user?.id) {
    res.statusCode = 403;
    throw new Error("Missing Tokens");
  }
  const noteId = req.params.id;
  const { title, description } = req.body;

  const note = await Note.findByPk(noteId);
  if (!note) {
    res.statusCode = 404;
    throw new Error("Note not found");
  }

  // Create history before updating
  await NoteHistory.create({
    noteId: note.id,
    changedBy: res.locals.user.id,
    prevTitle: note.title,
    prevDescription: note.description,
    newTitle: title,
    newDescription: description,
  });

  await note.update({ title, description });
  res.json(note);
});

// Delete a Note
router.delete("/:id", async (req, res) => {
  if (!res.locals.user?.id) {
    res.statusCode = 403;
    throw new Error("Missing Tokens");
  }
  const noteId = req.params.id;
  await Note.destroy({ where: { id: noteId } });
  await NoteHistory.create({
    noteId: parseInt(noteId),
    changedBy: res.locals.user.id,
    prevTitle: "",
    prevDescription: "",
    newTitle: "",
    newDescription: "",
  });

  res.send("Note deleted");
});

// Get Collaborators for a Note
router.get("/:id/collaborators", async (req, res) => {
  const noteId = req.params.id;
  const collaborators = await Collaboration.findAll({
    where: { noteId },
    include: User,
  });
  res.json(collaborators);
});

export default router;
