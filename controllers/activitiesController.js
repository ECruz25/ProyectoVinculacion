const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

exports.subirActividades = (req, res) => {
  if (!req.user) {
    res.render('addPictures', { title: 'Subir Actividad' });
  } else {
    res.render('addPictures', { title: 'Subir Actividad', loggedIn: true });
  }
};

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next(
        {
          message: 'That filetype is not supported'
        },
        false
      );
    }
  }
};

exports.resize = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;

  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, 755);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
};

exports.getActividades = (req, res) => {
  try {
    var actividades = JSON.parse(
      fs.readFileSync('../public/actividades.json', 'utf8')
    );
  } catch (error) {
    var actividades = {};
  }
  console.log(actividades);
  res.render('actividades', { title: 'Actividades', actividades: actividades });
  res.end();
};
exports.upload = multer(multerOptions).any();
