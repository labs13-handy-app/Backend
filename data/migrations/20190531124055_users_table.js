exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();

    tbl
      .string('stripe_id')
      .notNullable()
      .unique();

    tbl
      .string('payout_id')
      .notNullable()
      .unique();

    tbl.string('name');

    tbl.string('nickname');

    tbl.string('account_type');

    tbl.string('email');

    tbl.string('address');

    tbl.string('phone_number');

    tbl.string('skills');

    tbl.string('experience');

    tbl.string('licenses');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
