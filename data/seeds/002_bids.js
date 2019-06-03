exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('bids')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('bids').insert([
        {
          project_id: 2,
          price: '15',
          time: '03',
          materials_included: 'no'
        },
        {
          project_id: 2,
          price: '16',
          time: '02',
          materials_included: 'no'
        },
        {
          project_id: 5,
          price: '10',
          time: '03',
          materials_included: 'yes'
        },
        {
          project_id: 5,
          price: '17',
          time: '01',
          materials_included: 'no'
        },
        {
          project_id: 3,
          price: '20',
          time: '05',
          materials_included: 'yes'
        }
      ]);
    });
};
