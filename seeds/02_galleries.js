exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('galleries')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('galleries').insert([
        {
          author: 'picasso',
          link:
            'https://static01.nyt.com/images/2018/03/02/arts/design/02picasso-print/01picasso1-articleLarge.jpg?quality=75&auto=webp&disable=upscale',
          description: 'a work of art',
          user_id: 2,
        },
        {
          author: 'van Gogh',
          link:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
          description: 'starry night',
          user_id: 2,
        },
        {
          author: 'picasso',
          link:
            'https://images.pexels.com/photos/290275/pexels-photo-290275.jpeg?cs=srgb&dl=architecture-blue-sky-buildings-290275.jpg&fm=jpg',
          description: 'sky scrapin',
          user_id: 1,
        },
      ]);
    });
};
