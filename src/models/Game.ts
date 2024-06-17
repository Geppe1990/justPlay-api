import { Schema, model, Document, Types } from "mongoose"
import Genre from "./Genre"
import Platform from "./Platform"

interface IGame extends Document {
	name: string
	summary: string
	release_dates: Array<{ id: number; y: number }>
	genres: Types.ObjectId[] // Array di ObjectId che fanno riferimento ai documenti di Genre
	platforms: Types.ObjectId[] // Array di ObjectId che fanno riferimento ai documenti di Platform
}

const gameSchema = new Schema({
	name: { type: String, required: true },
	summary: String,
	release_dates: [{ id: Number, y: Number }],
	genres: [{ type: Schema.Types.ObjectId, ref: Genre }],
	platforms: [{ type: Schema.Types.ObjectId, ref: Platform }],
})

const Game = model<IGame>("Game", gameSchema)

export default Game
