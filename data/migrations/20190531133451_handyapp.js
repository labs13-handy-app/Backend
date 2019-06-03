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
        .inTable('users');

      tbl.string('description', 500).notNullable();
      tbl.string('images', 255).notNullable();
      tbl.string('materials_included', 255).notNullable();
    })
    .createTable('bids', tbl => {
      // the projects table must be created before this table is created
      tbl.increments();

      tbl
        .integer('project_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('projects');
      tbl.string('price', 255).notNullable();
      tbl.string('time', 255).notNullable();
      tbl.string('materials_included', 255).notNullable();
    });
};

exports.down = function(knex, Promise) {
  // tables with FK must be removed before the referenced table is removed
  return knex.schema.dropTableIfExists('projects').dropTableIfExists('bids');
};
