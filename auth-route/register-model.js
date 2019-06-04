const db = require('../data/dbConfig.js');

module.exports = {
  getUser,
  getUserById,
  getUserByName,
  addUser,
  updateUser
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

function updateUser(id, update) {
  return db('users')
    .where('id', id)
    .update(update);
}
