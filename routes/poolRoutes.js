const express = require('express');
const router = express.Router();
const poolCtrl = require('../Controllers/poolController');
const { authMiddleware } = require('../middleware/auth');

/* ---- member routes ---- */
router.post('/', authMiddleware, poolCtrl.createPool);                    // POST /api/pools
router.get('/my', authMiddleware, poolCtrl.listMyPools);                 // GET  /api/pools/my
router.post('/:poolId/join', authMiddleware, poolCtrl.joinPool);         // POST /api/pools/:poolId/join
router.post('/:poolId/contribute', authMiddleware, poolCtrl.contribute); // POST /api/pools/:poolId/contribute

/* ---- investment proposals ---- */
router.post('/:poolId/invest', authMiddleware, poolCtrl.proposeInvestment);           // POST /api/pools/:poolId/invest
router.post('/:poolId/invest/:invId/vote', authMiddleware, poolCtrl.voteInvestment);  // POST /api/pools/:poolId/invest/:invId/vote

/* ---- info ---- */
router.get('/:poolId', authMiddleware, poolCtrl.getPool); // GET /api/pools/:poolId

module.exports = router;
