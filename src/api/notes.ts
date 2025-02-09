import express from "express";
import Note from "../models/Note";
import NoteHistory from "../models/NoteHistory";
import User from "../models/User";
import Collaboration from "../models/Collaboration";
import { Op } from "@sequelize/core";
import {
  createNoteSchema,
  createNoteType,
  inviteCollaboratorSchema,
  inviteCollaboratorType,
  noteByIdSchema,
  noteByIdType,
  updateNoteSchema,
  updateNoteType,
} from "../validators/note-validators";
import { io } from "..";

const router = express.Router();

// Create a Note
router.post("/", async (req, res) => {
  if (!res.locals.user?.id) {
    res.statusCode = 403;
    throw new Error("Missing Tokens");
  }
  const result = createNoteSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }
  const { title, description, category }: createNoteType = result.data;
  const note = await Note.create({
    title,
    description: description || null,
    category,
    createdBy: res.locals.user.id,
  });

  res.status(201).send(note);
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
    include: [
      { model: User, attributes: ["id"] },
      {
        model: Collaboration,
        attributes: ["id", "userId", "noteId"],
        include: { model: User, attributes: ["id", "name", "avatar"] },
      },
    ],
  });
  res.json(notes);
});

// Get Specific Note
router.get("/:id", async (req, res) => {
  if (!res.locals.user?.id) {
    res.statusCode = 403;
    throw new Error("Missing Tokens");
  }

  const result = noteByIdSchema.safeParse(req.params);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }
  const { id }: noteByIdType = result.data;
  const note = await Note.findByPk(id, { include: Collaboration });
  if (!note) {
    res.statusCode = 404;
    throw new Error("Note not found");
  }
  if (
    note.createdBy !== res.locals.user.id &&
    !note.Collaborations?.some((c) => c.userId === res.locals.user.id)
  ) {
    res.statusCode = 403;
    throw new Error("Forbidden");
  }
  res.json(note);
});

// Update a Note
router.put("/:id", async (req, res) => {
  if (!res.locals.user?.id) {
    res.statusCode = 403;
    throw new Error("Missing Tokens");
  }
  const resultId = noteByIdSchema.safeParse(req.params);
  if (!resultId.success) {
    res.status(400).json({ errors: resultId.error.format() });
    return;
  }

  const result = updateNoteSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }

  const { id }: noteByIdType = resultId.data;
  const { title, description, category }: updateNoteType = result.data;

  const note = await Note.findByPk(id, { include: Collaboration });
  if (!note) {
    res.statusCode = 404;
    throw new Error("Note not found");
  }

  if (
    note.createdBy !== res.locals.user.id &&
    !note.Collaborations?.some((c) => c.userId === res.locals.user.id)
  ) {
    res.statusCode = 403;
    throw new Error("Forbidden");
  }

  // Create history before updating
  await NoteHistory.create({
    noteId: note.id,
    changedBy: res.locals.user.id,
    prevTitle: note.title,
    prevDescription: note.description || null,
    newTitle: title,
    newDescription: description || null,
  });

  const updatedNote = await note.update({ title, description, category });
  io.to(`note_${note.id}`).emit("note_update", updatedNote);
  res.json(note);
});

// Delete a Note
router.delete("/:id", async (req, res) => {
  if (!res.locals.user?.id) {
    res.statusCode = 403;
    throw new Error("Missing Tokens");
  }
  const result = noteByIdSchema.safeParse(req.params);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }
  const { id }: noteByIdType = result.data;

  const note = await Note.findByPk(id, { include: Collaboration });
  if (!note) {
    res.statusCode = 404;
    throw new Error("Note not found");
  }
  if (note.createdBy !== res.locals.user.id) {
    res.statusCode = 403;
    throw new Error("Forbidden");
  }

  await NoteHistory.create({
    noteId: id,
    changedBy: res.locals.user.id,
    prevTitle: "",
    prevDescription: "",
    newTitle: "",
    newDescription: "",
  });
  await Note.destroy({ where: { id } });
  io.to(`note_${id}`).emit("note_delete", id);
  res.send("Note deleted");
});

// Get Collaborators for a Note
router.get("/:id/collaborators", async (req, res) => {
  const result = noteByIdSchema.safeParse(req.params);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }
  const { id }: noteByIdType = result.data;
  const collaborators = await Collaboration.findAll({
    where: { noteId: id },
    include: User,
  });
  res.json(collaborators);
});

router.post("/invite", async (req, res) => {
  if (!res.locals.user?.id) {
    res.statusCode = 403;
    throw new Error("Missing Tokens");
  }
  const result = inviteCollaboratorSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }
  const { noteId, email }: inviteCollaboratorType = result.data;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.statusCode = 404;
    throw new Error("User isn't on the platform");
  }
  // TODO: send an email for register if user doesn't exist
  const collaboration = await Collaboration.create({
    userId: user.id,
    noteId: noteId,
  });
  io.to(`note_${noteId}`).emit("note_invite", user.id);
  res.send(collaboration);
});

export default router;
