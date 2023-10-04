import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products:{
        type:[
            {
                quantity:{
                    type:Number,
                    default:1
                },
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"products"
                },
                _id: false,
            }
        ],
        default: [],
    }
})

mongoose.set('strictQuery', false);

cartSchema.pre("find", function() {
    this.populate("products.product");
});

const cartModel = mongoose.model("cart", cartSchema);
export default cartModel;