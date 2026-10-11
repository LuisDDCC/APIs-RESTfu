//Education
import { Router } from 'express'; 
import * as InstitutosController from '../controllers/institutos.controller'; 
const router = Router(); 

//GET
router.get('/', InstitutosController.getInstitutosList); 

router.get('/:id', InstitutosController.getInstitutoItem); 

// POST - un instituto (7.3)
router.post('/', InstitutosController.postInstitutoItem);

// POST - muchos institutos (7.3.1)
router.post('/many', InstitutosController.addManyInstitutos);

// POST - Push a subdocumento
router.post('/:id/contactos', InstitutosController.pushObjToInstituto);

//PUT 
//8.3
router.put('/:id', InstitutosController.putInstitutoItem);
// PUT - Modificar contacto en subdocumento (8.1.1)
router.put('/:id/contactos', InstitutosController.setObjContactoInstituto);

// delete 
router.delete('/:id', InstitutosController.deleteInstituto);
export default router;