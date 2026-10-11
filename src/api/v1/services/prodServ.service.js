//Commerce
import ProdServ from '../models/ProdServ.js';
import boom from '@hapi/boom';
import { OK, FAIL } from '../../../middlewares/resp.handler.js';

//FIC: GET PRODUCTS AND SERVICES LIST 
export const getProdServList = async () => { 
  let prodServList; 
  try { 
        prodServList = await ProdServ.find(); 
        return(prodServList); 
  } catch (error) { 
    //res.status(500).json({ message: 'Error: ' + ficError }); 
    throw boom.internal(error); 
  } 
};

//FIC: GET PRODUCT OR SERVICE BY ID 
export const getProdServItem = async (id, keyType) => { 
  let prodServItem; 
   
  try { 
    if (keyType === 'OK') { 
       prodServItem = await ProdServ.findOne({ 
       IdProdServOK: id, 
      }); 
    } else if (keyType === 'BK') { 
        prodServItem = await ProdServ.findOne({ 
        IdProdServBK: id, 
      }); 
    } 
    return(prodServItem); 
  } catch (error) { 
    throw boom.internal(error); 
  } 
};

//Commerce
//FIC: API POST
//----------------------------------------
//FIC: 7.1 POST (ADD) Producto y/o Servicio 
export const postProdServItem = async (paProdServItem) => { 
	try { 
		const newProdServItem = new ProdServ(paProdServItem); 
		return await newProdServItem.save(); 
	} catch (error) { 
		throw error; 
	} 
};

//FIC: 7.1.1 POST (ADD MANY) Productos y/o Servicios desde Web/PWA
export const addManyProdServ = async (prodServ) => {
  try {
    const prodServAdded = await ProdServ.insertMany(prodServ, { ordered: true });
    return OK('Producto(s) y/o Servicio(s) agregado(s) correctamente al catálogo.', prodServAdded);
  } catch (error) {
    if (error.code === 11000) {
      return FAIL(
        'Alguno(s) de los productos enviados ya están registrados en el catálogo de la BD. Verifica la información e intenta de nuevo.',
        error
      );
    } else {
      return FAIL(
        'No se pudo agregar el Producto y/o Servicio al catálogo. Error en el servidor.',
        error
      );
    }
  }
};

//POST (PUSH) Agregar estatus a producto existente
export const pushObjEstatusProdServ = async (id, objEstatus) => {
  try {
    const prodServUpdated = await ProdServ.findOneAndUpdate(
      { IdProdServOK: id },
      { $push: { cat_prod_serv_estatus: objEstatus } },
      { new: true }
    );
    return { succes: true, prodServUpdated };
  } catch (error) {
    return { succes: false, error };
  }
};

//FIC: SERVICES PUT
//FIC: 8.1 PUT (MODIFY) Producto y/o Servicio completo
export const updateProdServ = async (id, body) => {
  try {
    const updatedProdServ = await ProdServ.findOneAndUpdate(
      { IdProdServBK: id },
      body,
      { new: true }
    );
    return updatedProdServ;
  } catch (error) {
    throw boom.internal(error);
  }
};

//FIC: 8.1.1 PUT (MODIFY) Estatus dentro del arreglo cat_prod_serv_estatus
export const updateProdServEstatus = async (id, estatusData) => {
  try {
    const updatedProdServ = await ProdServ.findOneAndUpdate(
      {
        IdProdServBK: id,
        'cat_prod_serv_estatus.IdGenEstatusOk': estatusData.IdGenEstatusOk,
      },
      {
        $set: {
          'cat_prod_serv_estatus.$.TipoEstatus': estatusData.TipoEstatus,
          'cat_prod_serv_estatus.$.Actual': estatusData.Actual,
          'cat_prod_serv_estatus.$.Observacion': estatusData.Observacion,
        },
      },
      { new: true, strict: false } // ← agrega strict: false
    );
    return updatedProdServ;
  } catch (error) {
    throw boom.internal(error);
  }
};

//FIC: API DELETE
//----------------------------------------
//FIC: 9.1 DELETE (REMOVE) Producto y/o Servicio
export const deleteProdServItem = async (id) => {
  try {
    return await ProdServ.findOneAndDelete({ IdProdServBK: id });
  } catch (error) {
    throw boom.badImplementation(error);
  }
};