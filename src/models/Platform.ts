import { Schema, model, Document } from "mongoose"

interface IPlatform extends Document {
	name: string
}

const platformSchema = new Schema({
	name: { type: String, required: true },
})

const Platform = model<IPlatform>("Platform", platformSchema)

export default Platform
