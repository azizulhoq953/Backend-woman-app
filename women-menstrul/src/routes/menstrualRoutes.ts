import { Router } from 'express';
import { getMenstrualData, deleteMenstrualData } from '../controllers/menstrualController';

const MenstrualRoutes = Router();

MenstrualRoutes.get('/', getMenstrualData);
// router.post('/', addMenstrualData);
// router.put('/:id', updateMenstrualData);
MenstrualRoutes.delete('/:id', deleteMenstrualData);

export default MenstrualRoutes;