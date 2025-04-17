export default {
    Categorias: async function(pathCat) {
        try {
            console.log("Lo que nos llega: ", pathCat);

            //2. Si no se pasa nada, usamos 'raices' para pedir las principales
            //8. Si se pasa una categoria, la usamos para pedir las subcategorias de esa categoria
            const parametro = pathCat ? pathCat : 'raices';

            console.log("Llamando a Categorias con parametro:", parametro);
            const _respuesta = await fetch(`http://localhost:3003/api/zonaTienda/Categorias?pathCat=${parametro}`);
            const _resp = await _respuesta.json();

            if (_resp.codigo !== 0) {
                throw new Error(_resp.mensaje);
            }

            return _resp.datos;

        } catch (error) {
            console.log("Error al recuperar categorias:", error);
            return [];
        }
    },
     Productos: async function({request, params}){ //...loader de objeto Route de react-router-dom
         try {
             console.log('parametros del loader de react-router-dom en RECUPERARPRODUCTOS....', request, params);
             let _resp=await fetch(`http://localhost:3003/api/zonaTienda/Productos?pathCat=${params.pathCat}`);
             let _bodyResp=await _resp.json(); //<---- un objteto: { codigo: x, mensaje: ..., datos: .... }
 
             console.log('productos de categoria...', params.pathCat, _bodyResp)
             return _bodyResp.datos;
 
         } catch (error) {
             console.log('error al recuperar productos...', error.message);
             return null;                        
         }        
     }
}
