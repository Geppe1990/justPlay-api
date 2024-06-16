import { Schema, model, Document, Types } from "mongoose"

interface IGame extends Document {
	id: number
	name: string
	summary: string
	release_dates: Array<{ id: number, y: number }>
	genres: Types.ObjectId[] // Array di ObjectId che fanno riferimento ai documenti di Genre
	platforms: Types.ObjectId[] // Array di ObjectId che fanno riferimento ai documenti di Platform
}

const gameSchema = new Schema({
	id: { type: Number, required: true, unique: true },
	name: { type: String, required: true },
	summary: String,
	release_dates: [{ id: Number, y: Number }],
	genres: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
	platforms: [{ type: Schema.Types.ObjectId, ref: "Platform" }]
})

const Game = model<IGame>("Game", gameSchema)

export default Game
