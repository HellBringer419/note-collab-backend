import { z } from "zod";

// Validator for creating a new note
export const createNoteSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
});
export type createNoteType = z.infer<typeof createNoteSchema>;

// Validator for updating an existing note
export const updateNoteSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
});
export type updateNoteType = z.infer<typeof updateNoteSchema>;

// Validator for fetching a specific note (using note ID)
export const noteByIdSchema = z.object({
  id: z.string().transform(Number),
});
export type noteByIdType = z.infer<typeof noteByIdSchema>;

// Validator for inviting collaborators to a note
export const inviteCollaboratorSchema = z.object({
  noteId: z.number().int("Note ID must be an integer"),
  email: z.string().email("Invalid email address"),
});
export type inviteCollaboratorType = z.infer<typeof inviteCollaboratorSchema>;

// Validator for getting collaborators for a note
export const getCollaboratorsSchema = z.object({
  id: z.number(),
});
export type getCollaboratorsType = z.infer<typeof getCollaboratorsSchema>;
