exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();

    tbl.string('stripe_id').unique();

    tbl.string('payout_id');
    tbl.string('name');

    tbl.string('nickname').unique();

    tbl.string('account_type').defaultTo('homeowner');

    tbl.string('email').unique();

    tbl.string('address');

    tbl.string('phone_number');

    tbl.string('skills');

    tbl.string('experience');

    tbl.string('licenses');
    tbl.integer('balance', 128).defaultTo(0);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
