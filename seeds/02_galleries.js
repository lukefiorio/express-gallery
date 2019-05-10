'use strict';

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('galleries')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('galleries').insert([
        {
          title: 'Green trees',
          author: 'Mike Green',
          link:
            'https://images.unsplash.com/photo-1545289763-1a46ebc867ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
          description: 'A walk down memory lane',
          user_id: 2,
        },
        {
          title: 'Purple dandelion',
          author: 'Jen Smith',
          link:
            'https://images.unsplash.com/photo-1534710961216-75c88202f43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
          description: 'Down in the weeds...',
          user_id: 2,
        },
        {
          title: 'Orange sunflowers',
          author: 'Tom Madison',
          link:
            'https://images.unsplash.com/photo-1509366769187-d672ed1fe1e7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1052&q=80',
          description: 'Bright as the sun',
          user_id: 1,
        },
        {
          title: 'Tulips galore',
          author: 'Brett Hall',
          link:
            'https://images.unsplash.com/photo-1496264093734-ffe59b144f9d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
          description: 'A close-up of my garden',
          user_id: 2,
        },
        {
          title: 'Gardening tools',
          author: 'Sarah Thompson',
          link:
            'https://images.unsplash.com/photo-1523301551780-cd17359a95d0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80',
          description: 'Time to get to work!',
          user_id: 2,
        },
        {
          title: 'Garden tunnel',
          author: 'Silvia Brooks',
          link:
            'https://images.unsplash.com/photo-1541591643464-31a225ebd4a3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1053&q=80',
          description: 'Nice and shady',
          user_id: 3,
        },
        {
          title: 'Lake garden',
          author: 'Hector Johnson',
          link:
            'https://images.unsplash.com/photo-1532188978303-4bfaccc429d2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
          description: 'As calm as they come',
          user_id: 1,
        },
        {
          title: 'Modern garden',
          author: 'Robert Payne',
          link:
            'https://images.unsplash.com/photo-1500990625140-65260c43f3ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1051&q=80',
          description: 'I like my plants inside',
          user_id: 2,
        },
      ]);
    });
};
