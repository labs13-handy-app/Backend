exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('projects')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('projects').insert([
        {
          user_id: 2,
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          images: 'img',
          materials_included: 'yes'
        },
        {
          user_id: 2,
          description:
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
          images: 'img',
          materials_included: 'yes'
        },
        {
          user_id: 3,
          description:
            'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          images: 'img',
          materials_included: 'no'
        },
        {
          user_id: 4,
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cursus euismod quis viverra nibh cras pulvinar. Commodo viverra maecenas accumsan lacus vel facilisis. ',
          images: 'img',
          materials_included: 'yes'
        },
        {
          user_id: 5,
          description:
            'Ullamcorper dignissim cras tincidunt lobortis feugiat. A diam maecenas sed enim. Ut tellus elementum sagittis vitae et leo. Eu non diam phasellus vestibulum lorem sed risus ultricies. Leo vel fringilla est ullamcorper eget nulla facilisi.',
          images: 'img',
          materials_included: 'no'
        }
      ]);
    });
};
