const db = require('../data/dbConfig.js');

module.exports = {
  getUser,
  getUserById,
  getUserByName,
  addUser
};

function getUser() {
  return db('users').select(
    'id',
    'name',
    'account_type',
    'email',
    'address',
    'phone_number',
    'skills',
    'experience',
    'licenses'
  );
}

function getUserById(id) {
  return db('users')
    .where({id})
    .first();
}

function getUserByName(name) {
  return db('users')
    .where({name})
    .first();
}

async function addUser(user) {
  const [id] = await db('users').insert(user);
  return db('users')
    .where({id})
    .first();
}
