const mongoose = require("mongoose");
const { addressSchema, imageSchema } = require("./common");
const { ref } = require("joi");


const cardSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    description: String,
    phone: String,
    email: String,
    web: String,
    image: imageSchema,
    address: addressSchema,
    bizNumber: Number,
    user_id: {type:mongoose.SchemaTypes.ObjectId},
    likes: [mongoose.SchemaTypes.ObjectId],
  },
  {
    timestamps: true,
  }
);

  cardSchema.statics.getNextBizNumber = async function () {
    try {
      const found = await Card.find({}).sort([["bizNumber",-1]]).limit(1).exec();
      if (found.length===0) return 1
      const nextBizNumber = found[0].bizNumber + 1;
      return nextBizNumber;
    } catch(err) {
      throw err
    }
  }


const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
