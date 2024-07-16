/*
============================================
============================================
            **** WARNING ****
  RUNNING THIS SCRIPT WILL DELETE AND\OR
  OVERWRITE YOUR BCARDS DATABASE !!!!!!!
============================================
============================================
*/

const connectDB = require('./config/db')
const { cards, users } = require('./data/data')
const Card = require('./models/Card')
const User = require('./models/User')

const seedAll = async() => {

  console.log('\nDatabase seeding started...');

  try {
      await Card.deleteMany();
      const insertedCards = await Card.insertMany(cards);
      console.log(`  [i] Inserted ${insertedCards.length} cards`);
      await User.deleteMany();
      const insertedUsers = await User.insertMany(users);
      console.log(`  [i] Inserted ${insertedUsers.length} users`);
      console.log('[v] Completed successfully');
      process.exit(0);

  } catch(e) {
      console.log('[x] Seeding error')
      console.log(e.message)
      process.exit(1);

  }

}


connectDB().then(()=>{
  seedAll()
});