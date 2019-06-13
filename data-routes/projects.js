const router = require('express').Router();
const db = require('../data/dbConfig.js');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const jwChecks = require('../middleware/jwtChecks.js');
const restricted = require('../config/restricted-middleware.js');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'data-routes/uploads');
  },
  filename: function(req, file, cb) {
    // console.log(file);
    cb(null, file.originalname);
  }
});

// const upload = multer({storage});

// router.post('/upload', (req, res, next) => {
//   const upload = multer({ storage }).single('image-input-key');
//   upload(req, res, function(err) {
//     if (err) {
//       return res.send(err);
//     }
//     res.json(req.file);
//   });
// });
const upload = multer({storage});

router.post(
  '/',
  jwChecks,
  restricted,
  upload.single('thumbnail'),
  async (req, res) => {
    console.log(req.file);
    try {
      if (!req.body.title || !req.body.description || !req.body.homeowner_id) {
        res.status(400).json({
          message:
            'In order to add a new project, title and description are required.'
        });
      } else {
        const [id] = await db('projects').insert(req.body, 'id');
        if (id) {
          const foundProject = await db('projects')
            .where({id})
            .first();
          if (!foundProject) {
            res.status(404).json({errorMessage: `Project doesn't exist!`});
          } else {
            const path = req.file.path;
            const uniqueFilename = new Date().toISOString();
            cloudinary.uploader.upload(
              path,
              {public_id: `handyapp/${uniqueFilename}`, tags: `app`}, // directory and tags are optional
              async function(err, image) {
                if (err) return res.send(err);
                const {id} = foundProject;
                const {secure_url: thumbnail} = image;
                const editedProject = await db('projects')
                  .where({id})
                  .update({...foundProject, thumbnail});
                if (!editedProject) {
                  res
                    .status(404)
                    .json({errorMessage: `Project doesn't exist!`});
                } else {
                  // remove file from server
                  const fs = require('fs');
                  fs.unlinkSync(path);
                  res.status(201).json(editedProject);
                }
                // return image detail
              }
            );
          }
        }
      }
    } catch (e) {
      console.log(e.message);
      res.status(500).json({errorMessage: ` Couldn't add project.`});
    }
  }
);

router.post(
  '/:id/images',
  jwChecks,
  restricted,
  upload.array('images', 5),
  async (req, res) => {
    let upload_image = () => {
      const filePaths = req.files.map(
        image =>
          new Promise((resolve, reject) => {
            const uniqueFilename = new Date().toISOString();
            let path = image.path;
            cloudinary.uploader.upload(
              path,
              {public_id: `handyapp/${uniqueFilename}`, tags: `app`}, // directory and tags are optional
              async (err, image) => {
                // if (err) reject(err);
                try {
                  const foundProject = await db('projects')
                    .where({id: req.params.id})
                    .first();
                  if (!foundProject) {
                    res
                      .status(404)
                      .json({errorMessage: `Project doesn't exist. `});
                  } else {
                    const data = {
                      project_id: foundProject.id,
                      image: image.secure_url
                    };
                    const addedImage = await db('project_images').insert(data);
                    if (addedImage) {
                      resolve(image.public_id);
                      res.status(201).json({
                        message: 'Images sucessfully added to database!'
                      });
                    } else {
                      res.status(500).json({
                        errorMessage: `Couldn't add the images in the database`
                      });
                    }
                  }
                } catch (err) {
                  console.log(err);
                  reject(err);
                }
              }
            );
          })
      );

      Promise.all(filePaths).then(result =>
        console.log({
          response: result
        })
      );
    };
    upload_image();
  }
);

// router.post('/', upload.single('image-input-key'), async (req, res, next) => {
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_SECRET,
//     api_secret: process.env.CLOUDINARY_API_KEY
//   });

//   try {
//     // console.log(req.file);
//     // console.log(req.body);
//     const path = req.file.path;
//     const uniqueFilename = new Date().toISOString();

//     cloudinary.uploader.upload(
//       path,
//       {public_id: `handyapp/${uniqueFilename}`, tags: `app`}, // directory and tags are optional
//       function(err, images) {
//         if (err) return res.send(err);
//         console.log('file uploaded to Cloudinary');
//         // remove file from server
//         const fs = require('fs');
//         fs.unlinkSync(path);
//         // return image details
//         console.log(err);
//         res.json(images.secure_url);
//         const link = images;
//         console.log(`+++ LINK +++++`, link);
//       }
//     );
//   } catch (e) {
//     console.log(e.message);
//     res.status(500).json({errorMessage: `Server error couldn't add project`});
//   }
// });

// router.post('/', jwChecks, (req, res) => {
//   if (
//     !req.body.description ||
//     !req.body.materials_included ||
//     !req.body.homeowner_id
//   ) {
//     res.status(400).json({
//       message:
//         'In order to add a new project, you must provide a description, some images, and if materials are included or not. '
//     });
//   } else {
//     db('projects')
//       .insert(req.body, 'id')
//       .then(project => {
//         res.status(200).json(project);
//       })

//       .catch(err => {
//         console.log(err.message);
//         res.status(500).json(err.message);
//       });
//   }
// });

router.get('/', (req, res) => {
  db('projects')
    .join('users', 'projects.homeowner_id', 'users.id')

    .select(
      'projects.id',
      'projects.description',
      {name: 'users.first_name'},
      'users.last_name',
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
          .join('users', 'bids.contractor_id','users.id')
          .select('bids.id','bids.price','bids.time','bids.materials_included','bids.contractor_id', 'users.first_name','users.last_name')
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
        res.status(404).json({message: 'the specified Project does not exist'});
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
