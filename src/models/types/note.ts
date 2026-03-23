type Note = {
    id: string,
    title: string,
    content: string,
    ownerId: string, // ini userId
    createdAt?: Date,
    updatedAt?: Date
}
//deleted langsung query condition (misal soft delete)
// type NoteResponse = Omit<Note, 'ownerId'>
type NoteRequest = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>

export type { Note, NoteRequest };