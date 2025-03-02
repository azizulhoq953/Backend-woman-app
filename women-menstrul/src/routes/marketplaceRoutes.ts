import { Router } from 'express';
import { getProducts, getProductById} from '../controllers/marketplaceController';

const MarketplaceRoute = Router();

MarketplaceRoute.get('/product', getProducts);
MarketplaceRoute.get('/product/:id', getProductById);
// router.post('/items', createMarketplaceItem);
// router.put('/items/:id', updateMarketplaceItem);
// router.delete('/items/:id', deleteMarketplaceItem);

export default MarketplaceRoute;