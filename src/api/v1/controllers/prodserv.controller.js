import * as ProdServServices from '../services/prodServ.service';
import boom from '@hapi/boom';

//FIC: API GET
//----------------------------------------
//FIC: Todos los Productos/Servicios.
export const getProdServList = async (req, res, next) => {
  try {
    const prodServList = await ProdServServices.getProdServList();
    if (!prodServList) {
      throw boom.notFound('No se encontraron productos/servicios registrados.');
    } else if (prodServList) {
      res.status(200).json(prodServList);
    }
  } catch (error) {
    next(error);
  }
};

//FIC: Solo un Producto/Servicio.
export const getProdServItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const keyType = req.query.keyType || 'OK';
    const prodServItem = await ProdServServices.getProdServItem(id, keyType);
    if (!prodServItem) {
      throw boom.notFound('No se encontraron productos/servicios registrados.');
    } else if (prodServItem) {
      res.status(200).json(prodServItem);
    }
  } catch (error) {
    next(error);
  }
};

//FIC: API POST
//----------------------------------------
//FIC: POST (ADD) Producto y/o Servicio
export const postProdServItem = async (req, res, next) => {
  try {
    const paProdServItem = req.body;
    const newProdServItem = await ProdServServices.postProdServItem(paProdServItem);
    if (!newProdServItem) {
      throw boom.badRequest('No se pudo crear el Producto y/o Servicio.');
    } else if (newProdServItem) {
      res.status(201).json(newProdServItem);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//POST (ADD MANY) Productos y/o Servicios desde Web/PWA
export const addManyProdServ = async (req, res, next) => {
  try {
    const prodServAdded = await ProdServServices.addManyProdServ(req.body);
    if (prodServAdded.fail) {
      res.status(409).json(prodServAdded);
    } else if (prodServAdded.success) {
      res.status(201).json(prodServAdded);
    }
  } catch (error) {
    next(error);
  }
};

//FIC: 7.1.2 POST (PUSH) Agregar estatus a producto existente
export const pushObjEstatusProdServ = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('FIC: controller id -> ', id);
    const objEstatus = req.body;
    console.log('FIC: controller body -> ', objEstatus);

    const updatedProdServItem = await ProdServServices.pushObjEstatusProdServ(id, objEstatus);

    if (!updatedProdServItem.succes) {
      throw boom.badRequest('No se pudo agregar el estatus al Producto y/o Servicio.');
    } else {
      res.status(200).json(updatedProdServItem);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//FIC: API PUT
//----------------------------------------
//FIC: 8.1 PUT (MODIFY) Producto y/o Servicio completo
export const updateProdServ = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedProdServ = await ProdServServices.updateProdServ(id, body);
    res.json(updatedProdServ);
  } catch (error) {
    res.status(500).json({ message: 'Error: ' + error });
  }
};

//FIC: 8.1.1 PUT (MODIFY) Estatus dentro del arreglo cat_prod_serv_estatus
export const updateProdServEstatus = async (req, res) => {
  try {
    const { id } = req.params;
    const estatusData = req.body;
    const updatedProdServ = await ProdServServices.updateProdServEstatus(id, estatusData);
    res.json(updatedProdServ);
  } catch (error) {
    res.status(500).json({ message: 'Error: ' + error });
  }
};

//FIC: API DELETE
//----------------------------------------
//FIC: 9.1 DELETE (REMOVE) Producto y/o Servicio
export const deleteProdServItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('FIC: controller id -> ', id);

    const deletedProdServItem = await ProdServServices.deleteProdServItem(id);

    if (!deletedProdServItem) {
      throw boom.badRequest('No se pudo eliminar el Producto y/o Servicio.');
    } else if (deletedProdServItem) {
      res.status(200).json({
        message: 'Producto y/o Servicio eliminado correctamente.',
        data: deletedProdServItem
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};