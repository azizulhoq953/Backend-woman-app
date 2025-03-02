import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/marketplaceController';
const router = Router();
router.get('/product', getProducts);
router.get('/product/:id', getProductById);
// router.post('/items', createMarketplaceItem);
// router.put('/items/:id', updateMarketplaceItem);
// router.delete('/items/:id', deleteMarketplaceItem);
export default router;
