exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        {
          first_name: null,
          last_name: null,
          company_name: 'Icie Swift',
          isBoarded: true,
          nickname: 'icy',
          account_type: 'Contractor',
          email: 'Icie_Swift39@gmail.com',
          address: '576 Gaylord Circle, Port Kraigborough, FL 27367',
          phone_number: '218-441-6920',
          skills: 'Painting',
          experience: '3 years',
          licenses: 'State of CA Contractor',
          stripe_id: null,
          payout_id: null
        },
        {
          first_name: 'Nichole',
          last_name: 'Hagenes',
          company_name: null,
          isBoarded: true,
          nickname: 'nick',
          account_type: 'Homeowner',
          email: 'Nichole_Hagenes93@yahoo.com',
          address: '1413 Franecki Summit, McGlynntown, OH 13950',
          phone_number: '683-043-6942',
          skills: null,
          experience: null,
          licenses: null,
          stripe_id: null,
          payout_id: null
        },
        {
          first_name: 'Celia',
          last_name: 'Kerluke',
          company_name: null,
          isBoarded: true,
          nickname: 'cel',
          account_type: 'Contractor',
          email: 'Celia74@hotmail.com',
          address: '565 Cummings Port, Medhurstview, PA 81491-8773',
          phone_number: '309-054-7972',
          skills: 'Home cleaning',
          experience: '7 years',
          licenses: 'State of CA Contractor',
          stripe_id: null,
          payout_id: 'acct_1Ei6CzCr8302Affvs302sfs'
        },
        {
          first_name: 'Kara',
          last_name: 'Pagac',
          isBoarded: true,
          nickname: 'Kay',
          account_type: 'Homeowner',
          email: 'Kara_Pagac99@hotmail.com',
          address: '225 Dicki Vista, Jazlynview, WV 83632-3758',
          phone_number: '074-675-4516',
          skills: null,
          experience: null,
          licenses: null,
          stripe_id: 'cus_Yz5kjAoFCWy',
          payout_id: null
        },
        {
          first_name: 'Chanelle',
          last_name: 'Runolfsdottir',
          isBoarded: true,
          nickname: 'Chan',
          account_type: 'Contractor',
          email: 'Chanelle.Runolfsdottir36@yahoo.com',
          address: '24538 Ashlynn Place, New Bradenton, MS 05424-1596',
          phone_number: '092-597-6381',
          skills: 'Plumbing',
          experience: '8 years',
          licenses: 'State of IL Contractor',
          stripe_id: null,
          payout_id: 'acct_GHa5AT1Ei6CzCr83'
        }
      ]);
    });
};
