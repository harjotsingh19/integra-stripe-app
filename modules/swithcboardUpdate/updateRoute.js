import express from 'express';

import { getVersion } from './updateController.js';

const router = express.Router();


router.get('/',getVersion)

export default router;