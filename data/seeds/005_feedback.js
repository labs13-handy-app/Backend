exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('feedback')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('feedback').insert([
        {
          contractor_id: 1,
          reviewer_name:'Bob',
          title: 'Had bathroom redone',
          description: 'The bathroom renovations went amazing im so happy i choose this contractor!',
          rating: 10,
          recommend:'yes'
        },
        {
          contractor_id: 1,
          reviewer_name:'Jane',
          title: 'Needed shower regrouted and tile added',
          description: 'This contractor showed up right away and got to work. I am very pleased with how everything went.',
          rating: 8,
          recommend:'yes'
        },
        {
          contractor_id: 3,
          reviewer_name:'Sally',
          title: 'Living room had to be rewired',
          description: 'The job didnt go as planned. It ended up taking longer than expected and we still have an exposed wire.',
          rating: 3,
          recommend:'no'
        },
        {
          contractor_id: 3,
          reviewer_name:'Tim',
          title: 'We had a celing fan installed',
          description: 'Everything went great, we will keep this contractor in our minds for any other jobs!',
          rating: 10,
          recommend:'yes'
        },
        {
          contractor_id: 5,
          reviewer_name:'Ronald',
          title: 'New Deck',
          description: 'We had the contractor come and build a new deck on our house. It looks beautiful. It feels safe and secure and was stained perfectly, thank you!',
          rating: 10,
          recommend:'yes'
        },
        {
          contractor_id: 5,
          reviewer_name:'Louise',
          title: 'What was she thinking? ',
          description: 'All that we needed done was to have the wood replaced on our deck. Not only did the contractor try to charge us more than we orginally paid, she did a sub par job.',
          rating: 1,
          recommend:'no'
        }
      ]);
    });
};
