import { Schema, model } from "mongoose"

const starexDetails = new Schema({
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    }
})

export default model("StarexDetails", starexDetails)