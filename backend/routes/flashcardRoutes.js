import  express from 'express';
import {
    getFlashcards,
    getALLFlashcardSets,
    reviewFlashcards,
    toggleStarFlashcardSet,
    deleteFlashcardSet,
} from '../controllers/flashcardController.js';
import protect from '../middleware/auth.js';

const router = express.Router();
router.use(protect);


router.get('/', getALLFlashcardSets);
router.get('/:documentId', getFlashcards);
router.post('/:cardId/review', reviewFlashcards);
router.put('/:cardId/star', toggleStarFlashcardSet);
router.delete('/:id', deleteFlashcardSet);

export default router;  

