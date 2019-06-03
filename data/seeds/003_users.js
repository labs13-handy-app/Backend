exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        {
          name: 'Icie Swift',
          nickname: 'Icy',
          account_type: 'Professional',
          email: 'Icie_Swift39@gmail.com',
          address: '576 Gaylord Circle, Port Kraigborough, FL 27367',
          phone_number: '218.441.6920',
          skills: 'Painting',
          experience: '3',
          licenses: 'State of CA Contractor'
        },
        {
          name: 'Nichole Hagenes',
          nickname: 'Nick',
          account_type: 'Homeowner',
          email: 'Nichole_Hagenes93@yahoo.com',
          address: '1413 Franecki Summit, McGlynntown, OH 13950',
          phone_number: '683.043.6942',
          skills: '',
          experience: '',
          licenses: ''
        },
        {
          name: 'Celia Kerluke',
          nickname: 'Cel',
          account_type: 'Professional',
          email: 'Celia74@hotmail.com',
          address: '565 Cummings Port, Medhurstview, PA 81491-8773',
          phone_number: '309.054.7972',
          skills: 'Home cleaning',
          experience: '7',
          licenses: 'State of CA Contractor'
        },
        {
          name: 'Kara Pagac',
          nickname: 'Kay',
          account_type: 'Homeowner',
          email: 'Kara_Pagac99@hotmail.com',
          address: '225 Dicki Vista, Jazlynview, WV 83632-3758',
          phone_number: '074.675.4516',
          skills: '',
          experience: '',
          licenses: ''
        },
        {
          name: 'Chanelle Runolfsdottir',
          nickname: 'Chan',
          account_type: 'Professional',
          email: 'Chanelle.Runolfsdottir36@yahoo.com',
          address: '24538 Ashlynn Place, New Bradenton, MS 05424-1596',
          phone_number: '092.597.6381',
          skills: 'Plumber',
          experience: '8',
          licenses: 'State of IL Contractor'
        }
      ]);
    });
};
