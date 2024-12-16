import { Router } from 'express';
import { getItems, addItem } from '../controllers/items';

const router: Router = Router();

router.get('/', getItems);
router.post('/', addItem);

export default router;
