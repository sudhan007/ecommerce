import { Schema, model } from "mongoose";

const deliveryPersonSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true
    },

    isAvailable: {
        type: Boolean,
        default: true
    },
    orderHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },


});

export default model("Deliveryperson", deliveryPersonSchema);
