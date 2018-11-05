var express = require('express');
var router = express.Router();
const activitiesController = require('../controllers/activitiesController');
var multer = require('multer');
var upload = multer({ dest: 'public/uploads/' });
const fs = require('fs');
const url = require('url');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
var bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page. */
router.get('/', async function(req, res, next) {
  if (!req.user) {
    res.render('index', { title: 'Express' });
  } else {
    res.render('index', { title: 'Express', loggedIn: true });
  }
});
router.get('/login', (req, res) => {
  if (req.user) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

router.get('/historia', (req, res) => {
  try {
    var info = JSON.parse(fs.readFileSync('./public/info.json', 'utf8'));
    const historia = info.historia;
    if (!req.user) {
      res.render('historia', { title: 'Historia', historia, loggedIn: false });
    }
    res.render('historia', { title: 'Historia', historia, loggedIn: true });
  } catch (error) {
    var actividades = {};
    res.render('historia', { title: 'Historia' });
  }
});
router.get('/editHistoria', (req, res) => {
  try {
    if (!req.user) {
      res.redirect('/historia');
    } else {
      var info = JSON.parse(fs.readFileSync('./public/info.json', 'utf8'));
      const historia = info.historia;
      res.render('edit', {
        title: 'Editar Historia',
        info: historia,
        loggedIn: true,
        informacion: 'Historia'
      });
    }
  } catch (error) {
    var actividades = {};
    res.render('historia', { title: 'Historia' });
  }
});

router.post('/editHistoria', async (req, res) => {
  try {
    if (!req.user) {
      res.send(400);
    } else {
      let info = JSON.parse(fs.readFileSync('./public/info.json', 'utf8'));
      info.historia = req.body.editArea;
      await fs.writeFile('./public/info.json', JSON.stringify(info), err => {
        if (err) throw err;
        console.log('exito');
      });
    }
  } catch (error) {
    var actividades = {};
  }
  res.redirect('/historia');
});

router.get('/editMision', (req, res) => {
  try {
    if (!req.user) {
      res.redirect('/mision');
    } else {
      var info = JSON.parse(fs.readFileSync('./public/info.json', 'utf8'));
      const mision = info.misionVision.mision;
      res.render('edit', {
        title: 'Editar mision',
        info: mision,
        loggedIn: true,
        informacion: 'mision'
      });
    }
  } catch (error) {
    var actividades = {};
    res.render('historia', { title: 'Historia' });
  }
});

router.post('/editMision', async (req, res) => {
  try {
    if (!req.user) {
      res.send(400);
    } else {
      let info = JSON.parse(fs.readFileSync('./public/info.json', 'utf8'));
      info.misionVision.mision = req.body.editArea;
      await fs.writeFile('./public/info.json', JSON.stringify(info), err => {
        if (err) throw err;
        console.log('exito');
      });
    }
  } catch (error) {
    var actividades = {};
  }
  res.redirect('/info');
});
router.get('/editVision', (req, res) => {
  try {
    if (!req.user) {
      res.redirect('/vision');
    } else {
      var info = JSON.parse(fs.readFileSync('./public/info.json', 'utf8'));
      const vision = info.misionVision.vision;
      res.render('edit', {
        title: 'Editar Vision',
        info: vision,
        loggedIn: true,
        informacion: 'Vision'
      });
    }
  } catch (error) {
    var actividades = {};
    res.render('historia', { title: 'Historia' });
  }
});

router.post('/editVision', async (req, res) => {
  try {
    let info = JSON.parse(fs.readFileSync('./public/info.json', 'utf8'));
    info.misionVision.vision = req.body.editArea;
    await fs.writeFile('./public/info.json', JSON.stringify(info), err => {
      if (err) throw err;
      console.log('exito');
    });
  } catch (error) {
    var actividades = {};
  }
  res.redirect('/info');
});

router.get('/info', (req, res) => {
  try {
    var info = JSON.parse(fs.readFileSync('./public/info.json', 'utf8'));
    const misionvision = info.misionVision;
    const mision = misionvision.mision;
    const vision = misionvision.vision;
    if (!req.user) {
      res.render('info', {
        title: 'Mision y Vision',
        mision,
        vision,
        loggedIn: false
      });
    } else {
      res.render('info', {
        title: 'Mision y Vision',
        mision,
        vision,
        loggedIn: true
      });
    }
  } catch (error) {
    var actividades = {};
    res.render('info', { title: 'Mision y Vision' });
  }
});
router.get('/objetivos', (req, res) => {
  if (!req.user) {
    res.render('objetivos', { title: 'Objetivos' });
  } else {
    res.render('objetivos', { title: 'Objetivos', loggedIn: true });
  }
});
router.get('/Necesidades', (req, res) => {
  if (!req.user) {
    res.render('necesidades', { title: 'Necesidades' });
  } else {
    res.render('necesidades', { title: 'Necesidades', loggedIn: true });
  }
});
// router.get('/Actividades', (req, res) => {
//   try {
//     var actividades = JSON.parse(
//       fs.readFileSync('./public/actividades.json', 'utf8')
//     );
//   } catch (error) {
//     var actividades = {};
//   }
//   // console.log({ actividades });
//   res.render('actividades', { title: 'Actividades', actividades: actividades });
//   res.end();
// });
router.get('/actividades/cumpleanos', (req, res) => {
  try {
    var actividades = JSON.parse(
      fs.readFileSync('./public/actividades.json', 'utf8')
    );
    // console.log({ actividades });
    let actividades2 = [];
    for (const key in actividades) {
      if (actividades.hasOwnProperty(key)) {
        const element = actividades[key];
        if (element.tipoActividad === 'Cumpleaños') {
          actividades2.push(element);
        }
      }
    }

    if (!req.user) {
      res.render('actividades', {
        title: 'Actividades',
        actividades: actividades2
      });
    } else {
      res.render('actividades', {
        title: 'Actividades',
        actividades: actividades2,
        loggedIn: true
      });
    }
  } catch (error) {
    var actividades = {};
  }
});

router.get('/actividades/paseorecreativo', (req, res) => {
  try {
    var actividades = JSON.parse(
      fs.readFileSync('./public/actividades.json', 'utf8')
    );
    // console.log({ actividades });
    let actividades2 = [];
    for (const key in actividades) {
      if (actividades.hasOwnProperty(key)) {
        const element = actividades[key];
        if (element.tipoActividad === 'Paseo Recreativo') {
          actividades2.push(element);
        }
      }
    }

    if (!req.user) {
      res.render('actividades', {
        title: 'Actividades',
        actividades: actividades2
      });
    } else {
      res.render('actividades', {
        title: 'Actividades',
        actividades: actividades2,
        loggedIn: true
      });
    }
  } catch (error) {
    var actividades = {};
  }
});
router.get('/actividades/paseoeducativo', (req, res) => {
  try {
    var actividades = JSON.parse(
      fs.readFileSync('./public/actividades.json', 'utf8')
    );

    // console.log({ actividades });
    let actividades2 = [];
    for (const key in actividades) {
      if (actividades.hasOwnProperty(key)) {
        const element = actividades[key];
        if (element.tipoActividad === 'Paseo Educativo') {
          actividades2.push(element);
        }
      }
    }

    if (!req.user) {
      res.render('actividades', {
        title: 'Actividades',
        actividades: actividades2
      });
    } else {
      res.render('actividades', {
        title: 'Actividades',
        actividades: actividades2,
        loggedIn: true
      });
    }
    // console.log()
  } catch (error) {
    var actividades = {};
  }
});
router.get('/subirActividades', activitiesController.subirActividades);

router.post('/subirFotos', upload.any(), (req, res) => {
  try {
    var actividades = JSON.parse(
      fs.readFileSync('./public/actividades.json', 'utf8')
    );
  } catch (error) {
    var actividades = {};
  }
  // console.log(actividades);
  var file = req.files;
  console.log(file);
  const d = new Date();
  var archivos = {};
  file.forEach(element => {
    archivos[element.filename] = element.filename;
  });
  actividades[req.body.actividad] = {
    nombreArchivo: file[0].filename,
    tipoActividad: req.body.tipoActividad,
    descripcion: req.body.actividad,
    año: d.getFullYear(),
    mes: d.getMonth() + 1,
    archivos
  };
  console.log(file[0].filename);
  fs.writeFile(
    './public/actividades.json',
    JSON.stringify(actividades),
    error => {
      if (error) throw error;
      console.log('sad');
    }
  );
  res.redirect('/');
});

module.exports = router;
