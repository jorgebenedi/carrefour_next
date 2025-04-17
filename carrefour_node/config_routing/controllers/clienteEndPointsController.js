const mongoose = require('mongoose'); // Agregar esta línea
const bcrypt = require('bcrypt'); // Paquete para hashear passwords
const Cliente = require('../../models/cliente.js'); 
require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env
const miMailJetService = require('./../../servicios/MailJet.js'); // Asegúrate de que la ruta sea correcta
const jsonwebtoken = require('jsonwebtoken');

const Direccion=require('../../models/direccion');
const Provincia=require('../../models/provincia');
const Municipio=require('../../models/municipio');
const Pedido = require('../../models/pedido');

module.exports = {
    Registro: async function (req, res, next) {
        try {
            console.log('Datos del registro del cliente:', req.body);
            const {nombre, apellidos, telefono, email, password, cp, tipoDocumento, dninif } = req.body;

            console.log('Conectando a MongoDB...');

            await mongoose.connect(`${process.env.URL_MONGODB}/${process.env.DB_MONGODB}`);

        
            const tarjetaCarrefour = new Date(Date.now()).getTime();

            console.log('Tarjeta Carrefour generada:', tarjetaCarrefour);

            const _nuevoCliente =  await new Cliente({
                    nombre,
                    apellidos,
                    telefono,
                    tarjetaCarrefour: tarjetaCarrefour,
                    cp,
                    dninif: {
                        tipo: tipoDocumento,  // ✅ Asegurar que `tipo` venga de `tipoDocumento`
                        numero: dninif     // ✅ Se espera que `documento` contenga el número
                    },
                    cuenta: { 
                        email: email,
                        password: bcrypt.hashSync(password, 10) },
                    direcciones: [],
                    pedidos: [],
                    activada: false,
                }).save();
                

            // 🔹 Generar código aleatorio de verificación
          const _code = crypto.randomUUID().substring(0, 6);

          console.log('Código de verificación generado al registrar:', _code);

          // Genera un JWT para la verificación del código
          const _jwt = jsonwebtoken.sign(
            { email, codigo: _code },
            process.env.JWT_SECRETKEY,
            { expiresIn: '15min' }
        );


        // 🔹 Crear plantilla de correo
        const _mailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://www.carrefour.es/myaccount/assets/images/logos/logo-carrefournew.png" alt="Carrefour" style="max-width: 200px; height: auto;">
            </div>
            
            <p>Para finalizar con la creación de tu cuenta Carrefour, introduce el código que te indicamos:</p>
            
            <h1 style="text-align: center; color: #333; background: #f5f5f5; padding: 15px; border-radius: 5px; letter-spacing: 2px;">
                <strong>${_code}</strong>
            </h1>
            
            <ul style="padding-left: 20px; margin-top: 25px;">
                <li style="margin-bottom: 10px;"><strong>¿Por qué te pedimos verificar tu correo electrónico?</strong></li>
                <li style="margin-bottom: 8px;">Nos preocupamos por la seguridad de tus datos</li>
                <li style="margin-bottom: 8px;">Podrás recuperar tu cuenta de forma segura en el futuro</li>
                <li style="margin-bottom: 8px;">Para que puedas aprovechar al máximo las ventajas de El Club Carrefour</li>
            </ul>
            
            <p style="font-weight: bold; margin-top: 25px;">Dispones de 10 minutos</p>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
                Si tienes problemas con tu cuenta o crees que alguien intenta acceder a ella, contacta con nuestro equipo de atención al cliente.
            </p>
        </div>
        `;

        const _bodyText = `Para finalizar con la creación de tu cuenta Carrefour, introduce el código que te indicamos: ${_code}`;

        // 🔹 Enviar email con Mailjet
        await miMailJetService.EnviarEmail(email, "Verifica tu cuenta", _bodyText, _mailTemplate);

        // Crear correo de bienvenida con el número de tarjeta
        const _mailTemplateBienvenida = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">

            <h1 style="color: #0046BE; font-size: 24px; margin-bottom: 20px;">
                ¡Ya eres de El Club Carrefour!
            </h1>

            <p style="font-size: 16px; margin-bottom: 10px;">
                Aquí tienes tu tarjeta El Club Carrefour
            </p>

            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; font-size: 22px; font-weight: bold; letter-spacing: 2px; margin: 20px auto; max-width: 300px;">
                ${tarjetaCarrefour}
            </div>

            <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Disfruta de tus beneficios exclusivos.
            </p>
        </div>
        `;

         // Enviar correo de bienvenida
         await miMailJetService.EnviarEmail(email, `Descubre todas las ventajas de El Club Carrefour`, _bodyText, _mailTemplateBienvenida);

        res.status(200).send({ 
            codigo: 0, 
            mensaje: 'Registro exitoso. Código de verificación enviado.', 
            datos: { cliente: _nuevoCliente, codigo: _code, jwtVerificacion: _jwt }
        });
        

        } catch (error) {
            console.error('Error al registrar el cliente en CarrefourDB:', error);

            // Manejar errores de validación de Mongoose
            if (error.name === 'ValidationError') {
                return res.status(400).send({ codigo: 1, mensaje: 'Error de validación: ' + error.message });
            }

            res.status(500).send({ codigo: 2, mensaje: 'Error al registrar el cliente, inténtelo más tarde.' });
        }
    },
    Login: async function (req, res, next) {
        try{
            const { email, password } = req.body;
            console.log('Datos del login email del cliente:', email);
            console.log('Datos del login password del cliente:', password);

            await mongoose.connect(`${process.env.URL_MONGODB}/${process.env.DB_MONGODB}`, { useNewUrlParser: true, useUnifiedTopology: true });
            let _datosCliente = await Cliente.findOne({'cuenta.email': email});
            console.log('Datos del cliente:', _datosCliente);
            if (!_datosCliente) throw new Error('El email no está registrado.'); // Si el cliente no existe, lanza un error

            if (! bcrypt.compareSync(password, _datosCliente.cuenta.password) ) 
                throw new Error('password incorrecta')

            // gernerar codigo de verifaicion 
            const _codigo = crypto.randomUUID().substring(0, 6);
            console.log('Código de verificación generado al iniciar sesión:', _codigo);
            const _jwtVerificacion = jsonwebtoken.sign(
                 {email, codigo: _codigo},
                  process.env.JWT_SECRETKEY, { issuer: 'http://localhost:3003',
                     expiresIn: '15min' } );

            // palntiall email , ey envio 
            res.status(200).send({ codigo: 0, mensaje: 'HAS ALCANZADO BIEN EL ENDPOINT DEL LOGIN.', datos:{ codigo: _codigo, jwt: _jwtVerificacion, datosCliente: _datosCliente}});
        }catch(error){
            console.error('Error al iniciar sesión:', error);
            res.status(500).send({ codigo: 1, mensaje: 'Error al iniciar sesión' + error});
        }
    },
    ActivarCuenta: async function (req, res, next) { 
        try {
            const { token, codigoVerificacion, datosCliente } = req.body;
    
            console.log("🔹 Datos recibidos en el backend:", { token, codigoVerificacion, datosCliente });
    
            if (!token || !codigoVerificacion || !datosCliente?.email) {
                return res.status(400).json({ codigo: 1, mensaje: "Faltan datos obligatorios" });
            }
            console.log("🔑 Clave secreta usada:", process.env.JWT_SECRETKEY);

            console.log("📜 Token recibido:", token);
            const decodedWithoutVerify = jsonwebtoken.decode(token);
            console.log("📜 Token decodificado sin verificar:", decodedWithoutVerify);

            // Verificar JWT
            let decoded;
            try {
                decoded = jsonwebtoken.verify(token, process.env.JWT_SECRETKEY);
                console.log("✅ JWT decodificado:", decoded);
            } catch (error) {
                return res.status(401).json({ codigo: 2, mensaje: "Token inválido o expirado" });
            }
    
            // Comparar código de verificación
            if (decoded.codigo !== codigoVerificacion) {
                return res.status(400).json({ codigo: 3, mensaje: "Código de verificación incorrecto" });
            }
    
            // Buscar al cliente por email
            const cliente = await Cliente.findOne({ 'cuenta.email': datosCliente.email });
    
            if (!cliente) {
                return res.status(404).json({ codigo: 4, mensaje: "Cliente no encontrado" });
            }
    
            // Verificar si ya está activado
            if (cliente.activada) {
                return res.status(400).json({ codigo: 5, mensaje: "La cuenta ya está activada" });
            }
    
            // Activar cuenta
            cliente.activada = true;
            await cliente.save();
    
            console.log("✅ Cuenta activada correctamente para:", datosCliente.email);
    
            return res.status(200).json({ codigo: 0, mensaje: "Cuenta activada exitosamente" });
    
        } catch (error) {
            console.error("❌ Error al activar cuenta:", error);
            return res.status(500).json({ codigo: 6, mensaje: "Error interno del servidor" });
        }
    }
,    
    ComprobarEmail: async function(req, res, next) {
        try {
            console.log('Comprobando email...', req.body.email);
            
            // Conectar a la base de datos de MongoDB
            await mongoose.connect(`${process.env.URL_MONGODB}/${process.env.DB_MONGODB}`, { useNewUrlParser: true, useUnifiedTopology: true });
            
            // Obtener la base de datos
            const db = mongoose.connection.db;
    
            // Buscar el correo en la colección de clientes
            const cuenta = await db.collection('clientes').findOne({ "cuenta.email": req.body.email });
    
            if (cuenta) {
                console.log('El email ya está registrado');
                res.status(200).send({ codigo: 1, mensaje: 'El email ya está registrado' });
            } else {
                console.log('El email no está registrado');
                res.status(200).send({ codigo: 0, mensaje: 'El email no está registrado' });
            }
        } catch (error) {
            console.log('Error comprobando email...', error);
            res.status(500).send({ codigo: 2, mensaje: 'Error comprobando email' });
        } finally {
            // Asegúrate de cerrar la conexión después de la operación
            await mongoose.disconnect();
        }
    },
   
    VerificarCode: async function (req, res, next) {
        // React envía en req.body: { operacion: 'Registro' o 'Login', email, codigo, jwt }
        try {
            const { operacion, email, codigo, jwt } = req.body;
            console.log('Datos recibidos para verificar el código: ', operacion );
            console.log('Datos recibidos para verificar el email: ', email );
            console.log('Datos recibidos para verificar el código: ', codigo );
            console.log('Datos recibidos para verificar el jwt: ', jwt );

            // 1. Verificamos que el JWT esté firmado correctamente
            const _payload = jsonwebtoken.verify(jwt, process.env.JWT_SECRETKEY); // esta el codigo y email
    
            // 2. Verificamos que email y código coincidan con el contenido del JWT
            if (_payload.email !== email || _payload.codigo !== codigo) {
                throw new Error('El código o el email no coinciden con el token.', _payload.codigo, codigo);
            }
    
            let _datos = {};
    
            if (operacion === 'Registro') {

                // 3a. Activamos la cuenta si es registro
                const _resp = await Cliente.updateOne(
                    { 'cuenta.email': email },
                    { $set: { activada: true } }
                );
    
                if (_resp.modifiedCount !== 1) {
                    throw new Error('Error interno en MongoDB al activar la cuenta.');
                }
    
                _datos = { mensaje: 'Cuenta activada correctamente' };
    
            } else if (operacion === 'Login') {

                // 3b. Si es login, recuperamos datos del cliente
                const _datosCliente = await Cliente.findOne({ 'cuenta.email': email })
                .populate(
                    [
                    {  path: 'direcciones', 
                        model: Direccion, 
                        populate: [
                            { path: 'provincia', model: Provincia },
                            { path: 'municipio', model: Municipio }
                        ]
                    },
                    { path: 'pedidos', model: Pedido }
                ]);

                if (!_datosCliente) {
                    throw new Error('Error al verificar el código: no existe cliente con este email.');
                }
    
                // Generamos JWT de sesión y refresh
                const _jwtSesion = jsonwebtoken.sign(
                    { tipo: 'jwtSesion', idCliente: _datosCliente._id },
                    process.env.JWT_SECRETKEY,
                    { issuer: 'http://localhost:3003', expiresIn: '1h' }
                );
    
                const _jwtRefresh = jsonwebtoken.sign(
                    { tipo: 'jwtRefresh', idCliente: _datosCliente._id },
                    process.env.JWT_SECRETKEY,
                    { issuer: 'http://localhost:3003', expiresIn: '7d' }
                );
    
                _datos = {
                    cliente: _datosCliente,
                    jwtSesion: _jwtSesion,
                    jwtRefresh: _jwtRefresh
                };
            } else {
                throw new Error('Operación no válida. Debe ser "Registro" o "Login".');
            }
    
            res.status(200).send({ codigo: 0, mensaje: 'Código 2FA verificado correctamente.', datos: _datos });
    
        } catch (error) {
            console.error('Error al verificar el código:', error);
            res.status(200).send({ codigo: 1, mensaje: 'Error en validación del código: ' + error.message });
        }
    }
}    



// pendiente dia 12/04/2025 hacer el login correctamente y hacer git de carrefour

// j3iok4jnhmljkLK"@