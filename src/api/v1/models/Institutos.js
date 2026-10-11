import * as mongoose from 'mongoose';

//Education
const institutosSchema = new mongoose.Schema({
    IdInstitutoOK     : { type: String, required: true },
    IdInstitutoBK     : { type: String, required: true },
    DesInstituto      : { type: String, required: true },
    Alias             : { type: String, required: false },
    Matriz            : { type: String, required: false },
    Giro              : { type: String, required: false },
    IdInstitutoSupOK  : { type: String, required: false },

    // ← nuevo subdocumento
    institutos_contactos: [
        {
            Nombre    : { type: String },
            Telefono  : { type: String },
            Email     : { type: String },
            Cargo     : { type: String },
            detail_row: {
                FechaReg   : { type: Date, default: Date.now },
                UsuarioReg : { type: String },
                Activo     : { type: String, default: 'S' },
                Borrado    : { type: String, default: 'N' },
            },
            _id: false,
        }
    ]
});

export default mongoose.model(
    'cat_institutos',
    institutosSchema,
    'cat_institutos'
)