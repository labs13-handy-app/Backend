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

const upload = multer({storage});

router.post('/', jwChecks, restricted, async (req, res) => {
  try {
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.homeowner_id ||
      !req.body.budget ||
      !req.body.category
    ) {
      res.status(400).json({
        message:
          'In order to add a new project, title, budget, category and description are required.'
      });
    } else {
      const project = {
        title: req.body.title,
        description: req.body.description,
        budget: req.body.budget,
        materials_included: req.body.materials_included,
        category: req.body.category,
        homeowner_id: req.body.homeowner_id
      };
      const [id] = await db('projects')
        .insert(project)
        .returning('id');
      if (id) {
        const foundProject = await db('projects')
          .where({id})
          .first();
        if (!foundProject) {
          res.status(404).json({
            errorMessage: `Project doesn't exist!`
          });
        } else {
          if (req.body.images) {
            for (let i = 0; i < req.body.images.length; i++) {
              const projectImage = {
                image: req.body.images[i],
                project_id: foundProject.id
              };

              const addedImage = await db('project_images').insert(
                projectImage
              );
            }
          }
          res.status(201).json(foundProject);
        }
      }
    }
  } catch ({message}) {
    console.log(message);
    res.status(500).json({message});
  }
});

// router.post(
//   '/upload/:id/images',
//   jwChecks,
//   restricted,

//   async (req, res) => {
//     console.log(req);
//     let upload_image = () => {
//       const filePaths = req.files.map(
//         image =>
//           new Promise((resolve, reject) => {
//             const uniqueFilename = new Date().toISOString();
//             let path = image.path;
//             cloudinary.uploader.upload(
//               path,
//               {public_id: `handyapp/${uniqueFilename}`, tags: `app`}, // directory and tags are optional
//               async (err, image) => {
//                 // if (err) reject(err);
//                 try {
//                   const foundProject = await db('projects')
//                     .where({id: req.params.id})
//                     .first();
//                   if (!foundProject) {
//                     res
//                       .status(404)
//                       .json({errorMessage: `Project doesn't exist. `});
//                   } else {
//                     const data = {
//                       project_id: foundProject.id,
//                       image: image.secure_url
//                     };
//                     const addedImage = await db('project_images').insert(data);
//                     if (addedImage) {
//                       resolve(image.public_id);
//                       res.status(201).json({
//                         message: 'Images sucessfully added to database!'
//                       });
//                     } else {
//                       res.status(500).json({
//                         errorMessage: `Couldn't add the images in the database`
//                       });
//                     }
//                   }
//                 } catch (err) {
//                   console.log(err);
//                   reject(err);
//                 }
//               }
//             );
//           })
//       );

//       Promise.all(filePaths).then(result =>
//         console.log({
//           response: result
//         })
//       );
//     };
//     upload_image();
//   }
// );

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
    .select('*')
    .then(projects => {
      const result = projects.map(async project => {
        project.images = [];
        project.bids = [];
        const images = await db('project_images').where({
          project_id: project.id
        });

        const bids = await db('bids').where({project_id: project.id});

        bids.map(bid => {
          if (bid.project_id === project.id) return project.bids.push(bid);
        });

        images.map(image => {
          if (image.project_id === project.id)
            return project.images.push(image.image);
        });
        return project;
      });

      Promise.all(result).then(result => {
        result.reverse();
        res.status(200).json(result);
      });
    })
    .catch(({message}) => {
      // console.log(err.message);
      res.json({message});
    });
});

router.get('/:id', async (req, res) => {
  try {
    const foundProject = await db('projects')
      .where({id: req.params.id})
      .first();

    if (foundProject) {
      const bids = await db('bids')
        .where({project_id: req.params.id})
        .join('users', 'bids.contractor_id', 'users.id')
        .select(
          'bids.id',
          'bids.price',
          'bids.time',
          'bids.materials_included',
          'bids.contractor_id',
          'users.first_name',
          'users.last_name'
        );

      const images = await db('project_images as pi')
        .where({project_id: req.params.id})
        .join('projects', 'pi.project_id', 'projects.id')
        .select('pi.image');

      const project = {
        ...foundProject,
        bids,
        images
      };

      res.status(200).json(project);
    }
  } catch ({message}) {
    res.status(500).json({message});
  }

  //     .then(project => {
  //       if (project) {

  //           .then(bids => {
  //             project.bids = bids;
  //             res.status(200).json(project);
  //           });

  // .then(images => {
  //           project.images = images;

  //         })
  //       } else {
  //         res.status(404).json({
  //           message: 'The project with the Specified ID does not exist'
  //         });
  //       }
  //     })
  //     .catch(err => {
  //       res.status(500).json({
  //         error: err,
  //         message: 'Unable to find the Specified prject at this time.'
  //       });
  //     });
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

router.delete('/:id', jwChecks, restricted, async (req, res) => {
  console.log(req.user);
  try {
    const id = parseInt(req.params.id);
    const user = req.user;
    const project = await db('projects')
      .where({id})
      .del();

    console.log(project);
    if (!project) {
      res
        .status(404)
        .json({errorMessage: 'No project was found for this user!'});
    } else {
      const projects = await db('projects').where({homeowner_id: req.user.id});
      res.status(200).json(projects);
    }
  } catch ({message}) {
    console.log(message);
    res.status(500).json({message});
  }
});

module.exports = router;
