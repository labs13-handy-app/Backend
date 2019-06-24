exports.up = function(knex, Promise) {
  // the tables must be created in the right order,
  // tables with FK are created after the referenced table is created
  return knex.schema
    .createTable('services', tbl => {
      tbl.increments();
      tbl
        .string('name', 128)
        .notNullable()
        .unique();
    })
    .createTable('projects', tbl => {
      tbl.increments();

      tbl
        .integer('homeowner_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');

      tbl.string('title', 128).notNullable();
      tbl.string('description', 500).notNullable();
      tbl.string('materials_included', 128).defaultTo('no');
      tbl.boolean('isActive').defaultTo(true);
      tbl.string('budget').defaultTo('0');
      tbl.string('category', 128).notNullable();
      tbl.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('bids', tbl => {
      tbl.increments();

      tbl
        .integer('project_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('projects')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');

      tbl
        .integer('contractor_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');

      tbl.integer('price').notNullable();
      tbl.string('time', 128).notNullable();
      tbl.string('materials_included', 128).defaultTo('no');
      tbl.boolean('isAccpted').defaultTo(false);
      tbl.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('project_images', tbl => {
      tbl.increments();
      tbl
        .integer('project_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

      tbl.string('image', 255);
      tbl.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('project_agreement', tbl => {
      tbl
        .integer('project_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('projects')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');

      tbl
        .integer('contractor_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');

      tbl.timestamp('created_at').defaultTo(knex.fn.now());

      tbl.primary(['project_id', 'contractor_id']);
    })
    .createTable('feedback', tbl => {
      tbl.increments();

      tbl
        .integer('contractor_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');

      tbl.string('reviewer_name', 255).notNullable();
      tbl.string('title', 255).notNullable();
      tbl.string('description', 255).notNullable();
      tbl.integer('rating');
      tbl.string('recommend', 5);
      tbl.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
  // tables with FK must be removed before the referenced table is removed
  return knex.schema
    .dropTableIfExists('services')
    .dropTableIfExists('projects')
    .dropTableIfExists('bids')
    .dropTableIfExists('project_images')
    .dropTableIfExists('project_agreement')
    .dropTableIfExists('feedback');
};
