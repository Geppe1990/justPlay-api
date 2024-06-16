import { Schema, model, Document } from "mongoose"

interface IGenre extends Document {
	id: number
	name: string
}

const genreSchema = new Schema({
	id: { type: Number, required: true, unique: true },
	name: { type: String, required: true }
})

const Genre = model<IGenre>("Genre", genreSchema)

export default Genre
