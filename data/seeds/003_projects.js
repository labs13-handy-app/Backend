exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('projects')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('projects').insert([
        {
          title: 'Bathroom Renovation',
          homeowner_id: 2,
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          materials_included: 'yes',
          category: 'Construction'
        },
        {
          title: 'Deck Renovation',
          homeowner_id: 2,
          description:
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
          materials_included: 'yes',
          category: 'Construction'
        },
        {
          title: 'Kitchen Renovation',
          homeowner_id: 3,
          description:
            'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          materials_included: 'no',
          category: 'Construction'
        },
        {
          title: 'Painting Living Room',
          homeowner_id: 4,
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cursus euismod quis viverra nibh cras pulvinar. Commodo viverra maecenas accumsan lacus vel facilisis. ',
          materials_included: 'yes',
          category: 'Painting'
        },
        {
          title: 'Grout Restoration',
          homeowner_id: 5,
          description:
            'Ullamcorper dignissim cras tincidunt lobortis feugiat. A diam maecenas sed enim. Ut tellus elementum sagittis vitae et leo. Eu non diam phasellus vestibulum lorem sed risus ultricies. Leo vel fringilla est ullamcorper eget nulla facilisi.',
          materials_included: 'no',
          category: 'Construction'
        }
      ]);
    });
};
