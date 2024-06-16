import { Schema, model, Document } from "mongoose"

interface IPlatform extends Document {
	id: number
	name: string
}

const platformSchema = new Schema({
	id: { type: Number, required: true, unique: true },
	name: { type: String, required: true }
})

const Platform = model<IPlatform>("Platform", platformSchema)

export default Platform
