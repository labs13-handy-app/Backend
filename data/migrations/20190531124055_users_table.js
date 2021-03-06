exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();

    tbl.string('stripe_id').unique();

    tbl.string('payout_id');

    tbl.string('first_name');

    tbl.string('last_name');

    tbl.string('avatar', 255);

    tbl
      .string('company_name', 128)
      .nullable()
      .unique();

    tbl.string('nickname').unique();

    tbl.string('account_type');

    tbl.string('email').unique();

    tbl.string('address');

    tbl.string('phone_number');

    tbl.string('skills');

    tbl.string('experience');

    tbl.string('licenses');

    tbl.boolean('isBoarded').defaultTo(false);

    tbl.integer('balance', 128).defaultTo(0);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
