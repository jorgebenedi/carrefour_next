import useGlobalStore from '../../../../globalState/storeGlobal';
import './Verificar2FAcode.css'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import restClientService from '../../../../servicios/restClientService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'


const Verificar2FAcode=()=>{
    const navigate = useNavigate();

    const { operacion }=useParams(); // <-.. deuvelve el objeto con este formato: { nombre_parametro }

    const { codigoVerificacion, jwt, datosCliente, setDatosCliente, setJwt } = useGlobalStore();

    const [ charsCode, setCharsCode ] = useState([]); // array de caracteres

   

    async function ValidarCodigo () {


        const _codigo = charsCode.join('');

        // Validamos que el código coincida
        if (_codigo === codigoVerificacion) {
            console.log("codigo correcto. redirigiendo...");
    
            // Si el código es correcto, validamos el JWT y lo enviamos al endpoint para activar la cuenta
            try {
                console.log("codigo de veri: " + codigoVerificacion)
                console.log("codigo de jwt lo que contine el email y el codigo: ", jwt)
                console.log("datos del cliente por si los utilizamos: ", datosCliente)



                console.log("JWT de verificación: ", jwt); // Verifica si está presente

                const _result = await restClientService.VerificarCode(operacion, datosCliente.cuenta.email, codigoVerificacion, jwt.verificacion );  // No necesitas pasar method, headers, ni body

                console.log("Resultado de la respuesta del backend: ", _result);
                if (_result.codigo === 0) {
                    if (operacion === 'Registro') {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Tu cuenta se ha activado correctamente",
                            showConfirmButton: false,
                            timer: 1500
                        });
                
                        navigate('/Cliente/Login');
                
                    } else  {
                        console.log("Login exitoso:", _result.mensaje);
                        setDatosCliente(_result.datos.cliente);
                        setJwt('sesion', _result.datos.jwtSesion);
                        setJwt('refresh', _result.datos.jwtRefresh);
                
                        Swal.fire({
                            icon: 'success',
                            title: 'Bienvenido de nuevo',
                            showConfirmButton: false,
                            timer: 1500
                        });
                
                        navigate('/');
                    }
                } else {
                    console.log("Login fallido: ", _result.mensaje);
                    alert("Código incorrecto o expirado.");
                }
                
            
                
            }catch (error) {
                console.error('Error al validar el código 2FA:', error);
                alert('Ocurrió un error. Intenta de nuevo.');
            }
    
        } else {
            alert("Código incorrecto. Inténtalo de nuevo.");
        }
    }
    

    return (

            <div className="container">
                <div className="row m-2">
                    <div className="col-md-2"></div>
                    <div className="col-md-6">
                        <div className="d-flex flex-column  text-center">
                            <picture><img src="https://www.carrefour.es/nlogin/img/v3/otpMail.svg" style={{"width": "96px", "height": "96px"}}/></picture>
                            <h4 className="text-title">{ operacion == 'Registro' ? 'Revista tu Email':'Confirma tu código' }</h4>
                            <p>{ operacion=='Registro' ? 'Para verificar tu cuenta introduce el código que te hemos' : 'Por tu seguridad, introduce el código que te hemos' }<br/> enviado a:</p>
                            <p id="otpSended" className="font-weight-600">...email usuario...</p>
                        </div>
                    </div>
                </div>

                <div className="row mt-2">
                    <div className="col-md-2"></div>
                    <div className="col-md-6">
                        <p>Código de verificación:*</p>
                    </div>
                </div>

                <div className="row m-2">
    <div className="col-md-2"></div>
    <div className="col-md-6 d-flex flex-row justify-content-center">
        {
        [1, 2, 3, 4, 5, 6].map((a, pos) => (

            <input
                type="tel"
                
                id={'code' + a}
                name={'code' + a}
                className="m-1 digito"
                aria-required="true"
                minLength="1"
                maxLength="1"
                placeholder=""
                aria-invalid="false"
                key={a}
                onChange={ev => setCharsCode(state => {
                    const newState = [...state];
                    newState[pos] = ev.target.value;
                    return newState;
                })}
            />
        ))
        }
    </div>
</div>


                <div className="row m-4">
                    <div className="col-md-2"></div>
                    <div className="col-md-6 ">            
                        <p style={{"backgroundColor": "#ECF3FD"}}><i className="fa-solid fa-circle-info" style={{"color":"#0970E6"}}></i>   Revisa tu carpeta de spam si el mensaje no <br/> aparece en tu bandeja de entrada</p>
                    </div>
                </div>

                <div className="row m-2">
                    <div className="col-md-2"></div>
                    <div className="col-md-6 d-flex flex-column justify-content-center">
                        <button type="button" className="botonReenviar">Reenviar codigo</button>
                        <button type="button" className="botonValidar" onClick={ValidarCodigo} >Validar codigo</button>
                    </div>
                </div>
            </div>   

    )
}

export default Verificar2FAcode;