exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('services')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('services').insert([
        {id: 1, name: 'Plumbing'},
        {id: 2, name: 'Construction'},
        {id: 3, name: 'Painting'},
        {id: 4, name: 'Electrical'},
        {id: 5, name: 'Gardening'},
        {id: 6, name: 'Cleaning'},
        {id: 7, name: 'Delivery'}
      ]);
    });
};
