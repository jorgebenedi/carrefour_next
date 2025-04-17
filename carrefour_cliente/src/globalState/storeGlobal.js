import { create } from 'zustand'


const useGlobalStore = create(
    (set, get , store)=>
                        {
                            console.log('paramtros que recibe funcion son: ', set,get,store);
                            return {
                                    codigoVerificacion: '',
                                    jwt: { sesion: '', refresh: '', verificacion: ''},
                                    datosCliente: {  },
                                    // funciones modificacion de props objeto state global , no pueden mutarlo!!! esto no valdria:
                                    //setCodigoVerificacion: codigo => set(state => state.codigoVerificacion=codigo)
                                    // tienes que sustituir el objeto del state por una copia con el valor de la propiedad modificada
                                    setCodigoVerificacion: (codigo) => set(state => {
                                        console.log('Estado actual:', state);  // Muestra el estado actual
                                        return { ...state, codigoVerificacion: codigo };  // Actualiza el código de verificación
                                      }),                              
                                    setJwt: (tipo,valorjwt)=> set(state => ({...state, jwt: {...state.jwt, [tipo]: valorjwt}})),   
                                    setDatosCliente: newdatosCliente => set(state => {
                                        const updatedState = {...state, datosCliente: {...state.datosCliente, ...newdatosCliente}};  // Crea el nuevo estado
                                        return updatedState;  // Retorna el nuevo estado
                                    })
                                     // setter : setDatosCliente
                                    // nnewDatpsCliente: nuevos datos que quiero añadir o actuliazar en el estagod global
                                    // set(state => {...}): es la funcion que actualiza el estado global, state es el estado acutal de al tienda
                                    // aqui empeiza la chicha aqui copiamos los datos actuales, del cliente,
                                    
                            }
                        }
);

export default useGlobalStore;