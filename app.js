// Creamos las instancias de las dependencias para nuestra API

// importamos express
const servExpress = require('express');
// importamos mysql
const mySql = require('mysql');
// importamos body-parse
const bodyParser = require('body-parser');

// En caso de que se realice el Deployment se define el puerto
// establecemos por default que si lo corremos localmente se apor el puero 3050
//const PORT = process.env.PORT || 3050;
const PORT = process.env.PORT || 443;    //PORT LivePerson

// Creamos una instancia del servidor express
const app = servExpress();

// importamos ejs (Gestor de Plantillas)
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Creamos la instancia de conexion a MySql para el IMSS via Google-Digitek
/*
const conexionBBDD = mySql.createPool({
    host: '10.100.8.42',
    user: 'INVAPLCHAT_USER',
    password: '$nv4plCh4tUs3r',
    database: 'SIABDD'
})
*/

const conexionBBDD = mySql.createPool({
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'be4c93595247c1',
    password: '55f78527',
    database: 'heroku_a4ac2dcd99be87f'
})


// =====================================================================
// Creamos la estructura del header de respuesta
// =====================================================================
let respuesta = {
    status: false,
    code: 200,
    message: '',
    respuesta: '{}'
};

// =====================================================================
// End Point ... Raiz ... Test
// =====================================================================
app.get('/cdi/', ( req, res ) => {
    respuesta = {
        status: true,
        code: 200,
        message: 'Welcome to my API IMSS_CDI v1.4 Nueva ruta /cdi/',
        respuesta: '{}'
    }
    res.send(respuesta);
    console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>\n\n');   
})

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//                          U  S  U  A  R  I  O  S
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// =============================================================================
// End Point. GET - Valida matricula de usuario (Ruta: usuarioMatricula)
// =============================================================================
app.get('/cdi/usuarioMatricula/:id', ( req, res ) => {
    const {id} = req.params;

    console.log('==========================================================================');
    console.log('Valida Matricula de usuario (IMSS-CDI) : <' + id + '>');
    console.log('--------------------------------------------------------------------------');
//    const sql = `SELECT CVE_USUARIO, NOM_NOMBRE, NOM_APELLIDOPATERNO, NOM_APELLIDOMATERNO, CVE_CORREO FROM SIAT_USUARIO WHERE CVE_MATRICULA = ${id}`;
    const sql = `SELECT CVE_USUARIO, NOM_NOMBRE, NOM_APELLIDOPATERNO, NOM_APELLIDOMATERNO, CVE_CORREO FROM SIAT_USUARIO WHERE CVE_MATRICULA = ${id} ORDER BY CVE_USUARIO LIMIT 1`;

    conexionBBDD.query(sql, (error, resultado) => {
        if (error) throw error;

        console.log(resultado);
        if (resultado.length > 0) {
            respuesta = {
                status: true,
                code: 200,
                message: 'Informaciòn del Usuario (IMSS-CDI)',
                respuesta: resultado
            }
        } else {
            respuesta = {
                status: false,
                code: 501,
                message: 'Informaciòn no válida',
                respuesta: '{}'
            }
        }
        console.log(respuesta);
        res.json(respuesta);
    });
    console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>\n\n');   
});

// =============================================================================
// End Point. GET - Valida matricula de usuario (Ruta: usuarioMat)
// =============================================================================
app.get('/cdi/usuarioMat/:id', ( req, res ) => {
    const {id} = req.params;

    console.log('==========================================================================');
    console.log('Valida Matricula de usuario sea valido para Problematica (IMSS-CDI) : <' + id + '>');
    console.log('--------------------------------------------------------------------------');
    var sql = 'SELECT clte.CVE_USUARIO, clte.NOM_NOMBRE, clte.NOM_APELLIDOPATERNO, clte.NOM_APELLIDOMATERNO, ';
    sql = sql + 'clte.CVE_CORREO, clte.CVE_MATRICULA, ooad.CVE_OOAD, ooad.NOM_CORTO, ooad.NOM_OOAD, ';
    sql = sql + 'ooad.CVE_TIPO_OOAD FROM SIAT_USUARIO clte ';
    sql = sql + 'INNER JOIN SIAC_OOAD AS ooad ON clte.CVE_CORREO = ooad.CVE_CORREO_TITULAR ';
    sql = sql + `WHERE clte.CVE_MATRICULA = ${id} `;
    console.log(sql);

    conexionBBDD.query(sql, (error, resultado) => {
        if (error) {
            //Do not throw err as it will crash the server. 
            console.log(error.code);
            console.log(error.message);
            const codError = "ERROR | Codigo: " + error.code;
            const msgError = "     Mensaje: " + error.message;
            const errorResult = codError + msgError;
            console.log(errorResult);
            respuesta = {
                status: false,
                code: 500,
                message: errorResult,
                respuesta: {}
            }

        } else {
            if (resultado.length > 0) {
                respuesta = {
                    status: true,
                    code: 200,
                    message: 'Informaciòn de Usuario Autorizado (IMSS-CDI)',
                    respuesta: resultado
                }
            } else {
                respuesta = {
                    status: false,
                    code: 501,
                    message: 'Informaciòn no válida',
                    respuesta: '{}'
                }
            }
        }
        console.log("Valida Usuario Autorizado Respuesta:  " + JSON.stringify(respuesta, null, '-'));
        res.send(respuesta);
    });
    console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>\n\n');   
});




////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//                     E  N  T  I  D  A  D  E  S
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// =============================================================================
// End Point. GET - Consulta todos la entidades (Ruta: entidades)
// =============================================================================
app.get('/cdi/entidades', ( req, res ) => {
    console.log('==========================================================================');
    console.log('Catalogo Entidades (IMSS-CDI)');
    console.log('--------------------------------------------------------------------------');

    const sql = 'SELECT * FROM SIAC_ENTIDAD';

    conexionBBDD.query(sql, (error, resultado) => {
        if (error) throw error;

        if (resultado.length > 0) {
            respuesta = {
                status: true,
                code: 200,
                message: 'Catalogo Entidadess (IMSS-CDI)',
                respuesta: resultado
            }
        } else {
            respuesta = {
                status: false,
                code: 501,
                message: 'No hay datos',
                respuesta: '{}'
            }
        }
        res.json(respuesta);
    });
    console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>\n\n');   
});


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//               U  N  I  D  A  D  E  S     1er   N  I  V  E  L
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// =============================================================================
// End Point. GET - Consulta una unidad nivel 1 por Entidad (Ruta: unidadesEntidad)
// =============================================================================
app.get('/cdi/unidadesEntidad/:id', ( req, res ) => {
    // Desestructuramos los paramettros que vienen en el request para obtener el ID
    const {id} = req.params;

    console.log('==========================================================================');
    console.log('Unidades asociadas a la Entidad (IMSS-CDI) : <' + id + '>');
    console.log('--------------------------------------------------------------------------');
    const sql = `SELECT CVE_OOAD, NOM_CORTO, NOM_OOAD, CVE_ENTIDAD FROM SIAC_OOAD WHERE CVE_ENTIDAD = ${id}`;

    conexionBBDD.query(sql, (error, resultado) => {
        if (error) throw error;

        if (resultado.length > 0) {
            respuesta = {
                status: true,
                code: 200,
                message: 'Informaciòn de la(s) Unidad(es) asociadas a una Entidad (IMSS-CDI)',
                respuesta: resultado
            }
        } else {
            respuesta = {
                status: false,
                code: 501,
                message: 'No existe información',
                respuesta: '{}'
            }
        }
        res.json(respuesta);
    });
    console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>\n\n');   
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//                 T I P O S   D E   P R O B L E M A S
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// =============================================================================
// End Point. GET - Consulta todos los tipos de problemas (Ruta: tipoProblematicas)
// =============================================================================
app.get('/cdi/tipoProblematicas', ( req, res ) => {
    console.log('==========================================================================');
    console.log('Catalogo Tipo de Problematicas (IMSS-CDI)');
    console.log('--------------------------------------------------------------------------');
    const sql = 'SELECT * FROM SIAC_TIPO_PROBLEMATICA';

    conexionBBDD.query(sql, (error, resultado) => {
/*
        if (error) throw error;

        if (resultado.length > 0) {
            respuesta = {
                status: true,
                code: 200,
                message: 'Catalogo Tipo de Problematicas (IMSS-CDI)',
                respuesta: resultado
            }
        } else {
            respuesta = {
                status: false,
                code: 501,
                message: 'No hay datos',
                respuesta: '{}'
            }
        }
        console.log(respuesta);
        res.json(respuesta);
    });
*/
        if (error) {
            //Do not throw err as it will crash the server. 
            console.log(error.code);
            console.log(error.message);
            const codError = "ERROR | Codigo: " + error.code;
            const msgError = "     Mensaje: " + error.message;
            const errorResult = codError + msgError;
            console.log(errorResult);
            respuesta = {
                status: false,
                code: 500,
                message: errorResult,
                respuesta: {}
            }

        } else {

            if (resultado.length > 0) {
                respuesta = {
                    status: true,
                    code: 200,
                    message: 'Catalogo Tipo de Problematicas (IMSS-CDI)',
                    respuesta: resultado
                }
            } else {
                respuesta = {
                    status: false,
                    code: 501,
                    message: 'No hay datos',
                    respuesta: '{}'
                }
            }
        }
        console.log(respuesta);
        res.json(respuesta);

        console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>\n\n');   
    });
});



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//                 P  R  O  B  L  E  M  A  T  I  C  A  S
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// =============================================================================
// End Point. GET - Consulta todos la problematica (Ruta: problematicas)
// =============================================================================
app.get('/cdi/problematicas', ( req, res ) => {
    console.log('==========================================================================');
    console.log('Problematicas (IMSS-CDI)');
    console.log('--------------------------------------------------------------------------');
    const sql = 'SELECT * FROM SIAC_PROBLEMATICA';

    conexionBBDD.query(sql, (error, resultado) => {
        if (error) throw error;

        if (resultado.length > 0) {
            respuesta = {
                status: true,
                code: 200,
                message: 'Consulta de Problematicas (IMSS-CDI)',
                respuesta: resultado
            }
        } else {
            respuesta = {
                status: false,
                code: 501,
                message: 'No hay datos',
                respuesta: {}
            }
        }
        res.json(respuesta);
    });
    console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>\n\n');   
});


// =============================================================================
// End Point. GET - Consulta las Problematicas por Tipo (Ruta: problematicasTipo)
// =============================================================================
app.get('/cdi/problematicasTipo/:id', ( req, res ) => {
    // Desestructuramos los paramettros que vienen en el request para obtener el ID
    const {id} = req.params;

    console.log('==========================================================================');
    console.log('Problematicas por Tipo (IMSS-CDI) : <' + id + '>');
    console.log('--------------------------------------------------------------------------');
    const sql = `SELECT CVE_PROBLEMATICA, NOM_NOMBRE, CVE_TIPO_PROBLEMATICA FROM SIAC_PROBLEMATICA WHERE CVE_TIPO_PROBLEMATICA = ${id}`;

    conexionBBDD.query(sql, (error, resultado) => {
        if (error) throw error;

        if (resultado.length > 0) {
            respuesta = {
                status: true,
                code: 200,
                message: 'Informaciòn de la(s) Problematica(s) asociadas a un tipo (IMSS-CDI)',
                respuesta: resultado
            }
        } else {
            respuesta = {
                status: false,
                code: 501,
                message: 'No existe información',
                respuesta: '{}'
            }
        }
        console.log(respuesta);
        res.json(respuesta);
    });
    console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>\n\n');   
});


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//                       N  I  V  E  L  E  S
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// =============================================================================
// End Point. GET - Consulta todo el catalogo de niveles (Ruta: niveles)
// =============================================================================
app.get('/cdi/niveles', ( req, res ) => {
    console.log('==========================================================================');
    console.log('Catalogo Niveles (IMSS-CDI)');
    console.log('--------------------------------------------------------------------------');
    const sql = 'SELECT * FROM SIAC_NIVEL';

    conexionBBDD.query(sql, (error, resultado) => {
        if (error) throw error;

        if (resultado.length > 0) {
            respuesta = {
                status: true,
                code: 200,
                message: 'Catalogo de Niveles (IMSS-CDI)',
                respuesta: resultado
            }
        } else {
            respuesta = {
                status: false,
                code: 501,
                message: 'No hay datos',
                respuesta: {}
            }
        }
        res.json(respuesta);
    });
    console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>\n\n');   
});


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//               O O A D    P  R  O  B  L  E  M  A  T  I  C  A
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// =============================================================================
// End Point. GET - Consulta todos los registros de OOAD Problematica (Ruta: ooadProblematicas)
// =============================================================================
app.get('/cdi/ooadProblematicas', ( req, res ) => {
    console.log('==========================================================================');
    console.log('OOAD Problematicas (IMSS-CDI)');
    console.log('--------------------------------------------------------------------------');
    const sql = 'SELECT * FROM SIAC_OOAD_PROBLEMATICA';

    conexionBBDD.query(sql, (error, resultado) => {
        if (error) throw error;

        if (resultado.length > 0) {
            respuesta = {
                status: true,
                code: 200,
                message: 'OOAD Problematicas (IMSS-CDI)',
                respuesta: resultado
            }
        } else {
            respuesta = {
                status: false,
                code: 501,
                message: 'No hay datos',
                respuesta: {}
            }
        }
        res.json(respuesta);
    });
    console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>\n\n');   
});

// =============================================================================
// End Point. GET - Consulta una OOAD Problematica (Ruta: ooadProblematicas)
// =============================================================================
app.get('/cdi/ooadProblematicas/:id', ( req, res ) => {
    // Desestructuramos los paramettros que vienen en el request para obtener el ID
    const {id} = req.params;

    console.log('==========================================================================');
    console.log('Problematicas (  IMSS-CDI) : <' + id + '>');
    console.log('--------------------------------------------------------------------------');
    const sql = `SELECT * FROM SIAC_OOAD_PROBLEMATICA WHERE CVE_OOAD_PROBLEMATICA = ${id}`;

    conexionBBDD.query(sql, (error, resultado) => {
        if (error) throw error;

        if (resultado.length > 0) {
            respuesta = {
                status: true,
                code: 200,
                message: 'Informaciòn de la OOAD Problematica (IMSS-CDI)',
                respuesta: resultado
            }
        } else {
            respuesta = {
                status: true,
                code: 204,
                message: 'No existe información',
                respuesta: {}
            }
        }
        res.json(respuesta);
    });
    console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>\n\n');   
});


// =============================================================================
// End Point. GET - Consulta los ultimos 3 registros de una OOAD (Ruta: ooadRegistradas)
// =============================================================================
app.get('/cdi/ooadRegistradas/:id', ( req, res ) => {
    // Desestructuramos los paramettros que vienen en el request para obtener el ID
    const {id} = req.params;

    console.log('==========================================================================');
    console.log('3 Ultimas Problematicas registradas por (  IMSS-CDI) : <' + id + '>');
    console.log('--------------------------------------------------------------------------');
//    const sql = `SELECT * FROM SIAC_OOAD_PROBLEMATICA WHERE CVE_OOAD= ${id} ORDER BY (CVE_OOAD_PROBLEMATICA) DESC LIMIT 3`;

    var sql = 'select op.CVE_OOAD_PROBLEMATICA, op.DES_OTRO, ss.NOM_NOMBRE STATUS, ';
    sql = sql + "sp.NOM_NOMBRE PROBLEMATICA_NOMBRE , sn.NOM_NOMBRE NIVEL, DATE_FORMAT(op.FEC_ALTA, '%Y-%m-%d') FEC_ALTA ";
    sql = sql + 'FROM  SIAC_OOAD_PROBLEMATICA op ';
    sql = sql + 'JOIN  SIAC_OOAD so USING(CVE_OOAD) ';
    sql = sql + 'JOIN  SIAC_PROBLEMATICA sp USING(CVE_PROBLEMATICA) ';
    sql = sql + 'JOIN  SIAC_STATUS_PROBLEMATICA ss USING(CVE_STATUS_PROBLEMATICA) ';
    sql = sql + 'JOIN  SIAC_NIVEL sn USING(CVE_NIVEL) ';
    sql = sql + `WHERE CVE_OOAD= ${id} `;
    sql = sql + 'ORDER BY op.CVE_OOAD_PROBLEMATICA DESC LIMIT 3'
    console.log(sql);

    conexionBBDD.query(sql, (error, resultado) => {
        if (error) {
            //Do not throw err as it will crash the server. 
            console.log(error.code);
            console.log(error.message);
            const codError = "ERROR | Codigo: " + error.code;
            const msgError = "     Mensaje: " + error.message;
            const errorResult = codError + msgError;
            console.log(errorResult);
            respuesta = {
                status: false,
                code: 400,
                message: errorResult,
                respuesta: {}
            }

        } else {
            if (resultado.length > 0) {
                respuesta = {
                    status: true,
                    code: 200,
                    message: 'Informaciòn de Usuario Autorizado (IMSS-CDI)',
                    respuesta: resultado
                }
            } else {
                respuesta = {
                    status: true,
                    code: 204,
                    message: 'No hay registros que cumplan las condiciones',
                    respuesta: ''
                }
            }
        }

        console.log(respuesta);
        res.json(respuesta);
    });
    console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>\n\n');   
});



// =============================================================================
// End Point. POST - Agrega una OOAD Problematica (Ruta: ooadProblematicas/add)
// =============================================================================
app.post('/cdi/ooadProblematicas/add', ( req, res ) => {
    const sql = 'INSERT INTO SIAC_OOAD_PROBLEMATICA SET ?';
    // Creamos un objeto customer utilizando la dependecia body-parser
    const ooadProblematicaObj = {
        NOM_RESPONSABLE: req.body.nombre_responsable,
        DES_OTRO: req.body.descripcion,
        CVE_OOAD: req.body.clave_ooad, 
        CVE_PROBLEMATICA: req.body.clave_problematica, 
        CVE_NIVEL: req.body.clave_nivel, 
        FEC_EXPIRA: req.body.fecha_expira,
        FEC_ALTA: req.body.fecha_alta,
        FEC_ACTUALIZACION: req.body.fecha_actualizacion,
        FEC_BAJA: req.body.fecha_baja,
        CVE_STATUS_PROBLEMATICA: req.body.status
    }

    console.log('==========================================================================');
    console.log('Alta de una Problematicas ( IMSS-CDI) ');
    console.log(ooadProblematicaObj);
    console.log('--------------------------------------------------------------------------');

    conexionBBDD.query(sql, ooadProblematicaObj, error => {
        if (error) {
            //Do not throw err as it will crash the server. 
            console.log(error.code);
            console.log(error.message);
            const codError = "ERROR | Codigo: " + error.code;
            const msgError = "     Mensaje: " + error.message;
            const errorResult = codError + msgError;
            console.log(errorResult);
            respuesta = {
                status: false,
                code: 500,
                message: errorResult,
                respuesta: {}
            }

        } else {
            respuesta = {
                status: true,
                code: 201,
                message: 'OOAD Problematica creada!',
                respuesta: {}
            }
        
        }

        console.log("Problematica-ADD Respuesta:  " + JSON.stringify(respuesta, null, '-'));

        res.send(respuesta);
    });

    console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>\n\n');   
});



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//                 P A N T A L L A S    W E B 
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////
// CONSULTA DE OOADD PROBLEMATICAS
//////////////////////////////////////////////////
app.get('/cdi/consultaOOAD', (peticion, respuesta) => {
    console.log('==========================================================================');
    console.log('OOAD Problematicas (IMSS-CDI) - Pantalla de consulta general');
    console.log('--------------------------------------------------------------------------');


    var sql = 'select op.CVE_OOAD_PROBLEMATICA, op.NOM_RESPONSABLE, op.DES_OTRO, so.NOM_NOMBRE OOAD_NOMBRE, ss.NOM_NOMBRE STATUS, ';
    sql = sql + "sp.NOM_NOMBRE PROBLEMATICA_NOMBRE , sn.NOM_NOMBRE NIVEL, DATE_FORMAT(op.FEC_ALTA, '%Y-%m-%d') FEC_ALTA ";
    sql = sql + 'FROM  SIAC_OOAD_PROBLEMATICA op ';
    sql = sql + 'JOIN  SIAC_OOAD so USING(CVE_OOAD) ';
    sql = sql + 'JOIN  SIAC_PROBLEMATICA sp USING(CVE_PROBLEMATICA) ';
    sql = sql + 'JOIN  SIAC_STATUS_PROBLEMATICA ss USING(CVE_STATUS_PROBLEMATICA) ';
    sql = sql + 'JOIN  SIAC_NIVEL sn USING(CVE_NIVEL) ';
    sql = sql + 'ORDER BY op.CVE_OOAD_PROBLEMATICA DESC ';

    console.log(sql);
    conexionBBDD.query(sql, (error, results)=>{
        if(error){
            throw error;
        }else{
            respuesta.render('index', {results:results});
        }
    });
    console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>\n\n');   
});


//////////////////////////////////////////////////
// EDITA UNA OOADD PROBLEMATICAS
//////////////////////////////////////////////////
app.get('/cdi/editaOOAD/:id', (peticion, respuesta) => {
    // Desestructuramos los paramettros que vienen en el request para obtener el ID
    const {id} = peticion.params;

    console.log('==========================================================================');
    console.log('OOAD Problematicas (IMSS-CDI) - Pantalla de consulta particular, clave:' + id);
    console.log('--------------------------------------------------------------------------');

    var sql = 'select op.CVE_OOAD_PROBLEMATICA, op.NOM_RESPONSABLE, op.DES_OTRO, so.NOM_NOMBRE OOAD_NOMBRE, ss.NOM_NOMBRE STATUS, ';
    sql = sql + "sp.NOM_NOMBRE PROBLEMATICA_NOMBRE , sn.NOM_NOMBRE NIVEL, DATE_FORMAT(op.FEC_ALTA, '%Y-%m-%d') FEC_ALTA ";
    sql = sql + 'FROM  SIAC_OOAD_PROBLEMATICA op ';
    sql = sql + 'JOIN  SIAC_OOAD so USING(CVE_OOAD) ';
    sql = sql + 'JOIN  SIAC_PROBLEMATICA sp USING(CVE_PROBLEMATICA) ';
    sql = sql + 'JOIN  SIAC_STATUS_PROBLEMATICA ss USING(CVE_STATUS_PROBLEMATICA) ';
    sql = sql + 'JOIN  SIAC_NIVEL sn USING(CVE_NIVEL) ';
    sql = sql + 'WHERE op.CVE_OOAD_PROBLEMATICA = ' + id;

    console.log(sql);
    conexionBBDD.query(sql, (error, results)=>{
        if(error){
            throw error;
        }else{
            respuesta.render('edit', {problema:results[0]});
        }
    });
    console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>\n\n');   
});


// =============================================================================
// End Point. POST - Actuailiza un registro de OOAD Problematica (Ruta: actualizaOOAD)
// =============================================================================
app.post('/cdi/actualizaOOAD', ( req, res ) => {
/*
    console.log(req.body);
    const DES_OTRO = req.body.DES_OTRO;
    const estado = req.body.estado;
    const nivel = req.body.nivel;
*/
    const idOOAD = req.body.id;
    const sql = 'UPDATE SIAC_OOAD_PROBLEMATICA SET ? WHERE CVE_OOAD_PROBLEMATICA = ?';
    // Creamos un objeto customer utilizando la dependecia body-parser
    const ooadProblematicaObj = {
        DES_OTRO: req.body.DES_OTRO,
        CVE_STATUS_PROBLEMATICA: req.body.estado,
        CVE_NIVEL: req.body.nivel
    }

    console.log('==========================================================================');
    console.log('Actualizacion de una Problematicas ( IMSS-CDI) ');
    console.log(ooadProblematicaObj);
    console.log('--------------------------------------------------------------------------');

    conexionBBDD.query(sql, [ooadProblematicaObj, idOOAD], error => {
        if (error) {
            //Do not throw err as it will crash the server. 
            console.log(error.code);
            console.log(error.message);
            const codError = "ERROR | Codigo: " + error.code;
            const msgError = "     Mensaje: " + error.message;
            const errorResult = codError + msgError;
            console.log(errorResult);
            respuesta = {
                status: false,
                code: 500,
                message: errorResult,
                respuesta: {}
            }

        } else {
            res.redirect('/cdi/consultaOOAD');
          }
        console.log("Problematica-Actualizacion Respuesta:  " + JSON.stringify(respuesta, null, '-'));
//        res.send(respuesta);
    });
    console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>\n\n');   
});


////////////////////////////////////////////////////////////////////////////////
// Llamamos a la funciòn listen, para verificar si hay eco en el puerto
////////////////////////////////////////////////////////////////////////////////
app.listen( PORT, () => console.log(`Server Running on Port ${PORT}`));
console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>\n\n');   
