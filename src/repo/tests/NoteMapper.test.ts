import type { Note } from "../../models/types/note.js"
import NoteMapper from "../utils/NoteMapper.js"

describe('NoteMapper Repo util unit test', ()=>{
    it("Should Mapping DB return value with proper Note Entity", ()=>{
        const dbResponse = {
            id : '12345',
            content: 'sebuah body note',
            title: 'Sebuah catatan',
            owner_id: 'user-123',
            created_at: new Date(),
            updated_at: new Date()
        }
        const entity: Note = {
            id : '12345',
            content: 'sebuah body note',
            title: 'Sebuah catatan',
            ownerId: 'user-123',
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const MappedResponse = NoteMapper(dbResponse)

        expect(MappedResponse).toHaveProperty('ownerId')
        expect(typeof MappedResponse).toEqual(typeof entity)
    })
})