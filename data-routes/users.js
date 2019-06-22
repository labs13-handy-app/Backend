const router = require('express').Router();
const db = require('../data/dbConfig.js');
const userDb = require('../auth-route/register-model.js');
const secrets = require('../config/secret.js');
const jwt = require('jsonwebtoken');
const jwChecks = require('../middleware/jwtChecks.js');
const restricted = require('../config/restricted-middleware.js');
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

// send file to Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const upload = multer({storage});

router.post(
  '/upload',
  jwChecks,
  restricted,
  upload.single('avatar'),
  async (req, res, next) => {
    try {
      const user = req.user;
      const path = req.file.path;
      const uniqueFilename = new Date().toISOString();

      cloudinary.uploader.upload(
        path,
        {public_id: `handyapp/${uniqueFilename}`, tags: `app`}, // directory and tags are optional
        async (err, avatar) => {
          if (err) return res.send(err);

          const newUser = {
            ...user,
            avatar
          };

          const result = await userDb.updateUser(user.id, newUser);
          if (result) {
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            // return image details
            res.status(201).json(newUser);
          }
        }
      );
    } catch (e) {
      console.log(e.message);
      res
        .status(500)
        .json({errorMessage: `Server couldn't add profile picture.`});
    }
  }
);

router.get('/', jwChecks, restricted, async (req, res) => {
  try {
    const users = await userDb.getUser();
    res.status(200).json(users);
  } catch (e) {
    res
      .status(500)
      .json({errorMessage: `Server error couldn't retrieve users!`});
  }
});

router.get('/:id', jwChecks, restricted, async (req, res) => {
  try {
    const activeUser = req.user;

    activeUser.projects = await db.raw(
      `SELECT p.* FROM projects as p WHERE p.homeowner_id = ${req.params.id}`
    );

    const projects = await activeUser.projects.map(async project => {
      const images = await db('project_images').where({
        project_id: project.id
      });

      const bids = await db('bids').where({project_id: project.id});

      project.images = images;
      project.bids = bids;

      return project;
    });
    activeUser.projects = await projects;
    Promise.all(projects).then(projects => {
      projects.reverse();
      const user = {...activeUser, projects};
      res.status(200).json({user});
    });
  } catch ({message}) {
    res.status(500).json({message});
  }
});

router.put('/:id', jwChecks, restricted, (req, res) => {
  db('users')
    .where({id: req.params.id})
    .update(req.body)
    .then(user => {
      if (user) {
        db('users')
          .where({id: req.params.id})
          .first()
          .then(user => {
            res.status(200).json(user);
          });
      } else {
        res.status(404).json({message: 'the specified User does not exist'});
      }
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json(err.message);
    });
});

// function generateToken(user) {
//   const payload = {
//     subject: user.id,
//     name: user.nickname,
//     account_type: user.account_type,
//     stripe_id: user.strpe_id,
//     payout_id: user.payout_id,
//     email: user.email
//   };
//   const options = {
//     expiresIn: '1h'
//   };
//   return jwt.sign(payload, secrets.jwtSecret, options);
// }

// router.put('/:id', jwChecks, restricted, async (req, res) => {
//   try {
//     const foundUser = await userDb.getUserById(req.user.id);
//     if (!foundUser) {
//       res
//         .status(404)
//         .json({errorMessage: `The specified User does not exist!`});
//     } else {
//       const editedUser = await userDb.updateUser(foundUser.id, req.body);
//       res
//         .status(200)
//         .json({message: 'User info successfully updated!', editedUser});
//     }
//   } catch (e) {
//     res.status(500).json(e.message);
//   }
// });

module.exports = router;
