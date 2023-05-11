// reuire the express package
const router = require('express').Router();

// set the different potential URL paths
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes');
const dashboardRoutes = require('./dashboard-routes');

router.use('./api', apiRoutes);
router.use('./', homeRoutes);
router.use('./dashboard', dashboardRoutes);

// create a 404 error status code if above paths are not matched
router.use((req, res) => {
    res.status(404).end();
});

// export code to the router
module.exports = router;