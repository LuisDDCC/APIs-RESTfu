import * as InstitutosServices from '../services/institutos.service.js';
import boom from '@hapi/boom';

//FIC: API GET 
//---------------------------------------- 
//FIC: Todos los Productos/Servicios. 
export const getInstitutosList = async (req, res, next) => { 
    try{ 
          const institutosList = await InstitutosServices.getInstitutosList(); 
          if (!institutosList) { 
            throw boom.notFound('No se encontro ningun instituto registrado.'); 
          } else if (institutosList) { 
            res.status(200).json(institutosList); 
          }  

      } catch(error) { 
        next(error); 
      } 
    };

    //FIC: Solo un Instituto.
  export const getInstitutoItem = async (req, res, next) => {
    try {
      //FIC: obtener parametro id mediante la 
      //desestructuracion de objetos
      const { id } = req.params;
      //FIC: se obtiene parametro de la forma
      //clase/objeto.
      //const idProdServ = req.params.id;
    const keyType = req.query.keyType || 'OK';
    const institutoItem = await InstitutosServices.getInstitutoItem(id, keyType);
    if (!institutoItem) {
      throw boom.notFound('No se encontro el instituto requerido.');
    } else if (institutoItem) {
      res.status(200).json(institutoItem);
    } 
   }catch(error){
    next(error);
  }
  };

  //7.2
  // API POST (ADD) Instituto
export const postInstitutoItem = async (req, res, next) => {
    try {
        const paInstitutoItem = req.body;
        const newInstitutoItem = await InstitutosServices.postInstitutoItem(paInstitutoItem);
        if (!newInstitutoItem) {
            throw boom.badRequest('No se pudo crear el Instituto.');
        } else if (newInstitutoItem) {
            res.status(201).json(newInstitutoItem);
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

//7.2.1
// API POST (ADD) Muchos Institutos
export const addManyInstitutos = async (req, res, next) => {
    try {
        const institutosAdded = await InstitutosServices.addManyInstitutos(req.body);
        if (institutosAdded.fail) {
            res.status(409).json(institutosAdded);
        } else if (institutosAdded.success) {
            res.status(201).json(institutosAdded);
        }
    } catch (error) {
        next(error);
    }
};

// 7.2.2 — POST push subdocumento (corresponde al servicio 7.1.2)
export const pushObjToInstituto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const objData = req.body;
        const result = await InstitutosServices.pushObjToInstituto(id, objData);
        if (!result.success) {
            throw boom.badRequest('No se pudo agregar el contacto al instituto.');
        } else {
            res.status(201).json(result);
        }
    } catch (error) {
        next(error);
    }
};

//PUT 
//FIC: API PUT
//----------------------------------------
//FIC: 8.1 PUT (MODIFY) Instituto completo
export const putInstitutoItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const updatedInstituto = await InstitutosServices.putInstitutoItem(id, body);
        res.json(updatedInstituto);
    } catch (error) {
        res.status(500).json({ message: 'Error: ' + error });
    }
};

//FIC: 8.1.1 PUT (MODIFY) Contacto dentro del arreglo institutos_contactos
export const setObjContactoInstituto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const objContacto = req.body;
        const updatedInstituto = await InstitutosServices.setObjContactoInstituto(id, objContacto);
        res.json(updatedInstituto);
    } catch (error) {
        res.status(500).json({ message: 'Error: ' + error });
    }
};

//DELETE 
export const deleteInstituto = async (req, res, next) => {
  try {
    const paIdInstituto = req.params.id;
    const deletedInstituto = await InstitutosServices.deleteInstituto(paIdInstituto);
    if (!deletedInstituto) {
      throw boom.notFound('No se pudo eliminar el Instituto, no se encontró el registro.');
    } else if (deletedInstituto) {
      res.status(200).json(deletedInstituto);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};