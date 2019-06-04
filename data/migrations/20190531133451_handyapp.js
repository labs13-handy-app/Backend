exports.up = function(knex, Promise) {
  // the tables must be created in the right order,
  // tables with FK are created after the referenced table is created
  return knex.schema
    .createTable('projects', tbl => {
      tbl.increments();

      tbl
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');

      tbl.string('description', 500).notNullable();
      tbl.string('images', 255).notNullable();
      tbl.string('materials_included', 128).defaultTo('no');
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
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');

      tbl.string('price', 255).notNullable();
      tbl.string('time', 255).notNullable();
      tbl.string('materials_included', 128).defaultTo('no');
    });
};

exports.down = function(knex, Promise) {
  // tables with FK must be removed before the referenced table is removed
  return knex.schema.dropTableIfExists('projects').dropTableIfExists('bids');
};
