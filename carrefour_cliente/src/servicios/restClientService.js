
export default {
    ComprobarEmail: async function(email) {
        try {
            let _repuesta = await fetch('http://localhost:3003/api/zonaCliente/ComprobarEmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const respuestaJson = await _repuesta.json();
            console.log('Respuesta del servidor:', respuestaJson); // Agregado aquí
            return respuestaJson.codigo === 1;  // Cambiado a 1 para cuando el email ya esté registrado
        } catch (error) {
            console.log("error comprobar email: ", error);
            return false;
        }
    }, 
    LoginRegistro: async function(operacion, datosForm){
        try {
            console.log("Enviando datos al backend:", { operacion });
            let _repuesta = await fetch(`http://localhost:3003/api/zonaCliente/${operacion}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosForm)
            });
            return await _repuesta.json();
        } catch (error) {
            console.log("error al registrar usuario: ", error);
            return false;
        }
    },
     // Activar cuenta
    //  ActivarCuenta: async function(token, codigoVerificacion, datosCliente) {
    //     try {
    //         console.log("Enviando datos al backend:", { token, codigoVerificacion, datosCliente });
    
    //         let _repuesta = await fetch('http://localhost:3003/api/zonaCliente/ActivarCuenta', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ 
    //                 token: token.verificacion,
    //                 codigoVerificacion,
    //                 datosCliente: {email: datosCliente.cuenta.email } })
    //         });
    
    //         if (!_repuesta.ok) {
    //             const errorText = await _repuesta.text(); // Obtiene el error como texto
    //             throw new Error(`Error al activar la cuenta: ${_repuesta.status} - ${errorText}`);
    //         }
    
    //         return await _repuesta.json();
    //     } catch (error) {
    //         console.error("Error al activar cuenta:", error);
    //         return false;
    //     }
    // },
    VerificarCode: async function(operacion, email, codigo, jwt) {
        try {    
            let _repuesta = await fetch('http://localhost:3003/api/zonaCliente/VerificarCode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ operacion, email, codigo, jwt })
            });
    
            if (!_repuesta.ok) {
                const errorText = await _repuesta.text(); // Obtiene el error como texto
                throw new Error(`Error al activar la cuenta: ${_repuesta.status} - ${errorText}`);
            }
    
            return await _repuesta.json();
        } catch (error) {
            console.error("Error al activar cuenta:", error);
            return false;
        }
    },
    Categorias: async function(pathCat) {
        try {
            
            const _respuesta = await fetch(`http://localhost:3003/api/zonaTienda/Categorias?pathCat=${pathCat}`);
            let _resp =  await _respuesta.json();

            if(_resp.codigo === 0 || _resp.status !== 200)  throw new Error(_resp.mensaje);
            
            return _resp.datos;

            } catch (error) {
                    console.log("Error al recuperar categorias:", error);
                    return [];
        }
    }
    
 
}


// 2m3jkhNJ"|@