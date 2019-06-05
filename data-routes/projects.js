const router = require('express').Router();
const db = require('../data/dbConfig.js');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'data-routes/uploads');
  },
  filename: function(req, file, cb) {
    console.log(file);
    cb(null, file.originalname);
  }
});

// router.post('/upload', (req, res, next) => {
//   const upload = multer({ storage }).single('image-input-key');
//   upload(req, res, function(err) {
//     if (err) {
//       return res.send(err);
//     }
//     res.json(req.file);
//   });
// });

router.post('/upload', (req, res, next) => {
  const upload = multer({storage}).single('image-input-key');
  upload(req, res, function(err) {
    if (err) {
      return res.send(err);
    }
    console.log('file uploaded to server');
    console.log(req.file);

    // send file to Cloudinary
    cloudinary.config({
      cloud_name: 'sandhu',
      api_key: '715129729739239',
      api_secret: 'yW0VuhyWZLCvOgLwFqVpM3nOi88'
    });

    const path = req.file.path;
    const uniqueFilename = new Date().toISOString();
    cloudinary.uploader.upload(
      path,
      {public_id: `handyapp/${uniqueFilename}`, tags: `app`}, // directory and tags are optional
      function(err, images) {
        if (err) return res.send(err);
        console.log('file uploaded to Cloudinary');
        // remove file from server
        const fs = require('fs');
        fs.unlinkSync(path);
        // return image details
        res.json(images);
      }
    );
  });
});

router.post('/', (req, res) => {
  if (
    !req.body.description ||
    !req.body.images ||
    !req.body.materials_included ||
    !req.body.user_id
  ) {
    res.status(400).json({
      message:
        'In order to add a new project, you must provide a description, some images, and if materials are included or not. '
    });
  } else {
    db('projects')
      .insert(req.body, 'id')
      .then(project => {
        res.status(200).json(project);
      })

      .catch(err => {
        res.status(500).json(err.message);
      });
  }
});

router.get('/', (req, res) => {
  db('projects')
    .join('users', 'projects.homeowner_id', 'users.id')

    .select(
      'projects.id',
      'projects.description',
      {name: 'users.name'},
      'projects.images',
      'projects.materials_included'
    )

    .then(projects => {
      res.status(200).json(projects);
    })

    .catch(err => res.send(err.message));
});

router.get('/:id', (req, res) => {
  db('projects')
    .where({id: req.params.id})
    .first()
    .then(project => {
      if (project) {
        db('bids')
          .where({project_id: req.params.id})
          .then(bids => {
            project.bids = bids;
            res.status(200).json(project);
          });
      } else {
        res.status(404).json({
          message: 'The project with the Specified ID does not exist'
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: 'Unable to find the Specified prject at this time.'
      });
    });
});

router.put('/:id', (req, res) => {
  db('projects')
    .where({id: req.params.id})

    .update(req.body)

    .then(count => {
      if (count > 0) {
        res.status(200).json({message: `${count} Project was updated`});
      } else {
        res.status(404).json({message: 'the specified Proect does not exist'});
      }
    })

    .catch(err => {
      res.status(500).json(err.message);
    });
});

router.delete('/:id', (req, res) => {
  db('projects')
    .where({id: req.params.id})

    .del()

    .then(count => {
      if (count > 0) {
        res.status(200).json({message: `${count} Project was deleted`});
      } else {
        res.status(400).json({message: 'the specified Project does not exist'});
      }
    })

    .catch(err => {
      res.status(500).json(err.message);
    });
});

module.exports = router;
