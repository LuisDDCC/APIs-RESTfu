//Education
import Institutos from '../models/Institutos.js';
import boom from '@hapi/boom';
import { OK, FAIL } from '../../../middlewares/resp.handler';

//FIC: GET INSTITUTES LIST 
export const getInstitutosList = async () => {
    try {
        console.log("========== DEBUG ==========");
        console.log("BASE DE DATOS:", Institutos.db.name);
        console.log("COLECCION:", Institutos.collection.name);

        const cantidad = await Institutos.countDocuments();

        console.log("CANTIDAD:", cantidad);

        const datos = await Institutos.find({}).lean();

        console.log("DATOS:", datos);
        console.log("===========================");

        return datos;

    } catch (error) {
        console.error("ERROR INSTITUTOS:", error);
        throw boom.internal(error);
    }
};
//FIC: GET INSTITUTE BY ID 
export const getInstitutoItem = async (id, keyType) => { 
  let institutoItem; 
   
  try { 
    if (keyType === 'OK') { 
       institutoItem = await Institutos.findOne({ 
       IdInstitutoOK: id, 
      }); 
    } else if (keyType === 'BK') { 
        institutoItem = await Institutos.findOne({ 
        IdInstitutoBK: id, 
      }); 
    } 
    return(institutoItem); 
  } catch (error) { 
    throw boom.internal(error); 
  } 
};

//7.1 Education
//FIC: POST (ADD) Instituto.
export const postInstitutoItem = async (paInstitutoItem) => {
    try { 
        const newInstitutoItem = new Institutos(paInstitutoItem); 
        return await newInstitutoItem.save();  
    } catch (error) { 
        throw error; 
    } 
};

//7.1.1
// POST (ADD) Muchos Institutos
export const addManyInstitutos = async (institutos) => {
    try {
        const institutosAdded = await Institutos.insertMany(institutos, { ordered: true });
        return OK('Instituto(s) agregado(s) correctamente al catálogo.', institutosAdded);
    } catch (error) {
        if (error.code === 11000) {
            return FAIL(
                'Alguno(s) de los institutos enviados ya están registrados en el catálogo de la BD. Verifica la información e intenta de nuevo.',
                error
            );
        } else {
            return FAIL(
                'No se pudo agregar el instituto al catálogo. Error en el servidor.',
                error
            );
        }
    }
};

//7.1.2
// PUSH objeto a un subdocumento de un Instituto
export const pushObjToInstituto = async (id, objData) => {
    try {
        const institutoUpdated = await Institutos.findOneAndUpdate(
            { IdInstitutoOK: id },
            { $push: { institutos_contactos: objData } }, 
            { new: true }
        );
        return { success: true, institutoUpdated };
    } catch (error) {
        return { success: false, error };
    }
};

//8.1
// PUT (MODIFY) Instituto
export const putInstitutoItem = async (id, paInstitutoItem) => {
    try {
        return await Institutos.findOneAndUpdate(
            { IdInstitutoOK: id },
            paInstitutoItem,
            { new: true }
        );
    } catch (error) {
        throw boom.badImplementation(error);
    }
};

//8.1.1
// SET - Modificar un contacto dentro del subdocumento institutos_contactos
export const setObjContactoInstituto = async (id, objContacto) => {
    try {
        const institutoUpdated = await Institutos.findOneAndUpdate(
            {
                IdInstitutoOK: id,
                institutos_contactos: {
                    $elemMatch: { Email: objContacto.Email }
                }
            },
            {
                $set: {
                    'institutos_contactos.$.Nombre'    : objContacto.Nombre,
                    'institutos_contactos.$.Telefono'  : objContacto.Telefono,
                    'institutos_contactos.$.Email'     : objContacto.Email,
                    'institutos_contactos.$.Cargo'     : objContacto.Cargo,
                    'institutos_contactos.$.detail_row': objContacto.detail_row,
                },
            },
            { new: true, strict: false }
        );
        return institutoUpdated;
    } catch (error) {
        throw boom.internal(error);
    }
};

//9.1 DELETE
export const deleteInstituto = async(poIdInstituto)=>{
    try{
        const deleteInstituto = await Institutos.findByIdAndDelete(poIdInstituto);
        return deleteInstituto;
    }catch(error){
        throw boom.badImplementation(error);
    }
}


