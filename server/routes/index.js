const express = require('express');
const router = express.Router();
const app = require('../next');
const isAuthenticated = require('../middlewares/isAuthenticated');

router.get('/check-status', (req, res) => {
  res.send('ok');
});

/* GET home page. */
router.get('/', (req, res) => app.render(req, res, '/feat-index', req.query));

// router.use('/settings', isAuthenticated);
router.get('/settings', isAuthenticated, (req, res) =>
  app.render(req, res, '/settings', req.query),
);

router.get('/authorize', isAuthenticated, (req, res) =>
  // TODO: nodejs logic
  app.render(req, res, '/authorize', req.query),
);

router.get('/profile/:userId', (req, res) =>
  app.render(req, res, '/user-profile', {
    userId: req.params.userId,
    ...req.query,
  }),
);

module.exports = router;
