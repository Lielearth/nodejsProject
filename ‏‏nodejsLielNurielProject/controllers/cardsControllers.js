const schemas = require("../schemas/cardsSchema");
const Card = require("../models/Card");
const User = require("../models/User");
const { token } = require("morgan");
const chalk = require("chalk");


const getAllCards = async (req, res) => {
  try {
    const allCards = await Card.find({});
    return res.status(200).json({success: true, data: allCards,
    });
  } catch (err) {
    console.log(chalk.red('Error'));
    return res.status(400).json({success: false,message: err.message,});
  }
};

const getCardById = async (req, res) => {
  const { id } = req.params;
  try {
    const found = await Card.findById(id).populate('user_id').exec();
    if (found) {
      return res.status(200).json({success: true, data: found,});
    }
    return res.status(404).json({success: false, message: `card id '${id}' not found`,});
  } catch (err) {
    console.log(chalk.red('Error'));
    return res.status(400).json({success: false, message: "could not find card id",});
  }
};

const createNewCard = async (req, res) => {
  const { error, value } = schemas.createNewCard.validate(req.body);
  if (error) {
    const errorsArray = error.details.map((err) => err.message); 
    return res.status(400).json({ success: false, message: errorsArray });
  }
  const newCard = new Card(value);
  newCard.bizNumber = await Card.getNextBizNumber();
  try {
    const saved = await newCard.save();
    return res.status(201).json({success: true, created: saved, });
  } catch (err) {
    console.log(chalk.red('Error'));
    return res.status(500).json({ success: false, message: `error saving the card` });
  }
};

const deleteCard = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Card.findByIdAndDelete(id);
    if (!deleted) throw new Error();
    return res.status(200).json({ success: true, deleted: deleted });
  } catch (err) {
    console.log(chalk.red('Error'));
    return res.status(404).json({ success: false, message: `card id ${id} not found` });
  }
};

const updateCard = async (req, res) => {
  const { error, value } = schemas.updateCard.validate(req.body);
  if (error) {
    const errorsArray = error.details.map((err) => err.message); 
    return res.status(400).json({ success: false, message: errorsArray });
  }
  const { id } = req.params;
  let updated;
  try {
    updated = await Card.findByIdAndUpdate(id, value, { new: true });
    if (!updated)
      return res.status(404).json({ success: false, message: `card id ${id} was not found.` });
    return res.status(200).json({success: true, updated: updated, });
  } catch (err) {
    console.log(chalk.red('Error'));
    return res.status(404).json({ success: false, message: `card id ${id} was not found.` });
  }
};

const getMyCards = async (req, res) => {
  try {
      const userId = req.user.id;
      const cards = await Card.find({user_id: userId});
      if(!cards) return res.status(404).json({ success: false, message: 'This user does not have cards' });
      return res.status(200).json({success: true, myCards: cards});
  } catch (error) {
      console.error('Error fetching cards:', error);
      return res.status(500).json({ success: false, message: 'Could not get user cards' });
  }
};

const likeAcard = async (req,res)=>{
  const { error, value } = schemas.likeCard.validate(req.body);
  if (error) {
    const errorsArray = error.details.map((err) => err.message); 
    return res.status(400).json({ success: false, message: errorsArray });
  }
  try {
    const { id } = req.params;
    const userId = value.userId;
    const card = await Card.findById(id).populate('user_id').exec();
    if (!card) {
        return res.status(404).json({ success: false, message: 'Card not found' });
    }
    if (card.likes.includes(userId)) {
        return res.status(400).json({ success: false, message: 'User already liked this card' });
    }
    card.likes.push(userId);
    await card.save();
    res.status(200).json({success: true, message: 'Card liked successfully', card});
} catch (error) {
    console.log(chalk.red('Error'));
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
}
}

const changeBizNumber = async (req, res) => {
  const { error, value } = schemas.changeBizNum.validate(req.body);
  if (error) {
    const errorsArray = error.details.map((err) => err.message); 
    return res.status(400).json({ success: false, message: errorsArray });
  }
    const { id } = req.params;
  try {
    const existedBizNum = await Card.findOne(value).exec();
  if (existedBizNum) {
    return res.status(400).json({ success: false, message: 'This bizNumber is already in use' });
}
  if(!existedBizNum){
    const biz = await Card.findByIdAndUpdate(id, value, { new: true }).exec();
    return res.status(200).json({ success: true, updated: biz });
  }
  } catch (err) {
    console.log(chalk.red('Error changing biznumber'));
    return res.status(500).json({ success: false, message: `Could not change BizNumber: ${err.message}` });
  }
}


module.exports = {
  getAllCards,
  getCardById,
  createNewCard,
  deleteCard,
  updateCard,
  getMyCards,
  likeAcard,
  changeBizNumber,
};
