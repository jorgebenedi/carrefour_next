import './Login.css'
import { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import useGlobalStore from '../../../../globalState/storeGlobal';
import restClienteService from '../../../../servicios/restClientService';

const Login=()=>{

    const navigate=useNavigate();
    const [ email, setEmail ]=useState('');
    const [ password, setPassword ]=useState('');
    const [ mensajeError, setMensajeError ]=useState(''); // para mostrar errores en la vista
    const { setCodigoVerificacion, setJwt, setDatosCliente}=useGlobalStore()

    async function HandleSubmit(ev){
        ev.preventDefault();
        const _resp=await restClienteService.LoginRegistro('Login', { email, password});
        if (_resp.codigo == 0) {

            // almaceno en el storage global codigo-verificiom, jwt-verificacion, datoscliente(email)
            setCodigoVerificacion(_resp.datos.codigo);
            console.log("jwt: ", _resp.datos.jwt);
            setJwt( 'verificacion', _resp.datos.jwt);
            setDatosCliente( _resp.datos.datosCliente);

            //redirijo a componente verificar2FA
            navigate('/Cliente/Verificar/Login');
            
        } else {
            
            //mostrar errores en vista
            setMensajeError(_resp.mensaje);
        }

    }

    return (
        <>
            <header className="header">
                <a href="/" >← Volver</a>
                    <img src="https://www.carrefour.es/myaccount/assets/images/logos/logo.svg" alt="Carrefour"/>
                <a href="#">🛈 Ayuda</a>
            </header>

            <div className="container mt-5">

                    <div className="row">
                        <div className="col-md-6 text-end start-saving-today">
                            <picture>
                                <img src="https://www.carrefour.es/nlogin/img/Club-Carrefour-Vienes.svg" alt="Club carrefour vienes"/>
                            </picture>
                            <h1 className="mb-4">Comienza <br/>a ahorrar hoy</h1>
                            <p className="lead">Únete y disfruta de las ventajas exclusivas <br/>por ser socio de El Club Carrefour</p>
                            <a href="https://www.carrefour.es/clubcarrefour/">Quiero saber más</a>
                            <br/>
                        </div>
                        <div className="col-2"></div>

                        <div className="col-md-4">
                            <h2 className="text-center mb-4">Tu cuenta</h2>
                            <span>Accede o <a href="/Cliente/Registro">crea una cuenta</a> </span>
                            <form onSubmit={HandleSubmit} className="formularioLogin">
                                <div className="form-floating mb-3">
                                    <input type="email" className="form-control" id="email" placeholder="Correo electronico *" required onChange={(ev) => setEmail(ev.target.value)} />
                                    <label htmlFor="email">Correo electrónico:</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" className="form-control" id="password" placeholder="Contraseña *"required onChange={(ev)=> setPassword(ev.target.value)}/>
                                    <label htmlFor="password">Contraseña:</label>
                                </div>
                                <div className="form-group text-center">
                                    <a href="#">¿Has olvidado tu contraseña?</a>
                                </div>
                                <button type="submit" className=" m-3 btn fakeSubmit" >Continuar</button>
                            </form>
                            <div className="text-center mt-3">
                                <a href="#">¿Problemas para acceder?</a>
                            </div>
                        </div>            
                    </div>

                </div>
        </>
    )
}

export default Login

