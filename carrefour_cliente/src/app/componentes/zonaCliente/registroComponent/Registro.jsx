import './Registro.css'
import { useEffect, useState } from 'react'
import restClientService from '../../../../servicios/restClientService';
import { useNavigate } from 'react-router-dom'
import useGlobalStore from '../../../../globalState/storeGlobal';
import axios from 'axios';  // Asegúrate de importar axios

const Registro = () => {

  const navigate = useNavigate();
  
  const { setJwt, setCodigoVerificacion, setDatosCliente } = useGlobalStore();

  //#region --- hooks: estado local, glogbal y efectos
  const [repassVisible, setRePassVisible] = useState(false)
  const [passVisible, setPassVisible] = useState(false)
  const [comprobarEmail, setComprobarEmail] = useState(false)

  const [mostrarRequisitos, setMostrarRequisitos] = useState(false);

  const [errorNombre, setErrorNombre] = useState(false)
  const [erroApellidos, setErroApellidos] = useState(false)
  const [errorTelefono, setErrorTelefono] = useState(false)
  const [errorDniNif, setErrorDniNif] = useState(false)
  const [errorCorreo, setErrorCorreo] = useState(false)
  const [errorCodigoPostal, setErrorCodigoPostal] = useState(false)
  const [formularioValido, setFormularioValido] = useState(false); // Nuevo estado para controlar la validez del formulario
  const [errorRePassword, setErrorRepassword] = useState(false); // Nuevo estado para controlar la validez del formulario
  const [errores, setErrores] = useState({}); // Estado para almacenar errores generales

  const [datosFormulario, setDatosFormulario] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    tipoDocumento: "DNI",
    dninif: "",
    email: "",
    password: "",
    repassword: "",
    cp: ""
  })




  // Estado para validaciones
  const [validacionPassword, setValidacionPassword] = useState({
    // Se recomienda almacaenar los criterios en el estate para que se actualicen
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasDigit: false,
    hasSpecialChar: false,
  });

  const [validaciones, setValidaciones] = useState({
    nombre: false,
    apellidos: false,
    telefono: false,
    dninif: false,
    email: false,
    cp: true, // Opcional, por defecto válido
  });

  function validarPassword(password) {
    const minLength = password.length >= 8 && password.length <= 40;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@.#$%^&*]/.test(password);

    setValidacionPassword({
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasDigit,
      hasSpecialChar,
    });

    // Actualizar validaciones generales
    setValidaciones((prev) => ({
      ...prev,
      password: minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar,
    }));
  }

    const allCriteriaMet = Object.values(validacionPassword).every(Boolean);

  useEffect(
      () => {
        console.log('valor del email y lanzzado peticion al server de enodejs para ver si exista ya', datosFormulario.email) 
        setComprobarEmail(false)
  }, 
  [comprobarEmail]
)

useEffect(() => {
  const allFieldsValid = Object.values(validaciones).every(Boolean) && allCriteriaMet;
  setFormularioValido(allFieldsValid);
}, [validaciones, allCriteriaMet]);

  // region funciones smanejadores de eventos

  const handlerInputChanges = async (ev) => {
    const { name, value } = ev.target;
    setDatosFormulario({ ...datosFormulario, [name]: value });
  
    // Validaciones dinámicas en tiempo real
    switch (name) {
      case 'nombre': {
        const esValido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim());
        setValidaciones({ ...validaciones, nombre: esValido && value.trim() });
        setErrorNombre(esValido ? '' : 'El nombre no debe contener números y es obligatorio');
        break;
      }
  
      case 'apellidos': {
        const esValido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim());
        setValidaciones({ ...validaciones, apellidos: esValido && value.trim() });
        setErroApellidos(esValido ? '' : 'Los apellidos no deben contener números y son obligatorios');
        break;
      }
  
      case 'telefono': {
        const regexTelefono = /^[67]\d{8}$/;
        const telefonoValido = regexTelefono.test(value.trim());
        setValidaciones({ ...validaciones, telefono: telefonoValido });
        setErrorTelefono(
          value.trim()
            ? telefonoValido
              ? ''
              : 'El teléfono debe empezar con 6 o 7 y tener 9 dígitos'
            : 'El teléfono es obligatorio'
        );
        break;
      }
  
      case 'dninif': {
        const regexDniNif = /^[0-9]{8}[A-Z]$/;
        const dniNifValido = regexDniNif.test(value.trim());
        setValidaciones({ ...validaciones, dninif: dniNifValido });
        setErrorDniNif(
          value.trim()
            ? dniNifValido
              ? ''
              : 'El DNI/NIF debe tener 8 dígitos y una letra mayúscula'
            : 'El DNI/NIF es obligatorio'
        );
        break;
      }
  
      case 'email': {
        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const emailValido = regexEmail.test(value.trim());
        setValidaciones({ ...validaciones, email: emailValido });
        setErrorCorreo(
            value.trim()
                ? emailValido
                    ? ''
                    : 'El correo no es válido'
                : 'El correo es obligatorio'
        );
    
       
    
        break;
    }
    
  
      case 'cp': {
        const regexCodigoPostal = /^\d{5}$/;
        const cpValido = !value.trim() || regexCodigoPostal.test(value.trim());
        setValidaciones({ ...validaciones, cp: cpValido });
        setErrorCodigoPostal(
          value.trim() && !cpValido
            ? 'El código postal debe tener exactamente 5 dígitos'
            : ''
        );
        break;
      }
  
      case 'password': {
        validarPassword(value);
        break;
      }
  
      case 'repassword': {
        const passwordsMatch = value === datosFormulario.password;
        setValidaciones({ ...validaciones, repassword: passwordsMatch });
        setErrorRepassword(
          passwordsMatch ? '' : 'Las contraseñas no coinciden'
        );
        break;
      }
  
      default:
        break;
    }
  };
  
async function handlerSubmit(ev){
  ev.preventDefault();
  console.log("valores del formulario", datosFormulario);

  // // Llamada para comprobar si el email ya está registrado
  // const _respComprobarEmail = await restClientService.ComprobarEmail(datosFormulario.email);
  
  // console.log("respuesta de comprobar email: " + _respComprobarEmail)
  // if (_respComprobarEmail) {
  //   // Si el email ya está registrado, mostrar mensaje de advertencia
  //   setErrorCorreo('Este correo ya está registrado, puedes iniciar sesión o restablecer tu contraseña');
  //   return;  // Detener el registro si el email ya existe
  // }
  // || !validaciones.email

  const _respRegistro = await restClientService.LoginRegistro('Registro',datosFormulario);
  if(_respRegistro.codigo === 0){
    console.log("Lo que recoge del enpoint registro: ", _respRegistro)

    // setNombres(pepitoGrillo);

    setCodigoVerificacion(_respRegistro.datos.codigo)
    //setCodigoVerificacion("123123")
    console.log("jwt de verificacion: ", _respRegistro.datos.jwtVerificacion)
    setJwt('verificacion', _respRegistro.datos.jwtVerificacion);
    setDatosCliente({cuenta: { email: _respRegistro.datos.cliente.cuenta.email }});
    navigate('/Cliente/verificar/Registro')
  }else{
    // fallo a la hora de registra cliente mostrar mensaje en la vista
  }
};

  return (
    <>
  <header className="header">
            <a href="/Cliente/Login">← Volver</a>
                <img src="https://www.carrefour.es/myaccount/assets/images/logos/logo.svg" alt="Carrefour"/>
            <a href="#">🛈 Ayuda</a>
          </header>
    

      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="registro-container">
          <h2>Crea tu cuenta</h2>
          <form onSubmit={handlerSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre*"
              name="nombre"
              value={datosFormulario.nombre}
              onChange={handlerInputChanges} 
             
            />
            {errorNombre && <small className="text-danger">{errorNombre}</small>}
          </div> {/* Cerrando correctamente el div */}


          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Apellidos*"
              name="apellidos"
              value={datosFormulario.apellidos}
              onChange={handlerInputChanges} 
            />
            {erroApellidos && <small className="text-danger">{erroApellidos}</small>}
          </div> {/* Cerrando correctamente el div */}


          <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Teléfono"
                name="telefono"
                value={datosFormulario.telefono}
                onChange={handlerInputChanges} 
             
              />
              {errorTelefono && <small className="text-danger">{errorTelefono}</small>}
            </div>
            <div className="mb-3">
              <div className="d-flex gap-2">
                <select className="form-select w-25" onChange={handlerInputChanges}  name='tipoDocumento'>
                  <option value="DNI" >DNI</option>
                  <option value="NIE">NIE</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>

                <input type="text" className="form-control w-75"
                placeholder="12345678A*" name="dninif" onChange={handlerInputChanges}
                />
              </div>
              {errorDniNif && (
                <div>
                  <small className="text-danger">{"   " + errorDniNif}</small>
                </div>
              )}
            </div>

            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Correo electrónico*"
                name="email"
                onChange={handlerInputChanges}
              />
              {errorCorreo && (
                <div>
                             <small className="text-danger">{"   " + errorCorreo}</small>

                </div>
              )}
            </div>

            <div className="input-group mb-3">
              <input type={passVisible ? "text" : "password"} className="form-control" placeholder="Contraseña*" 
                name="password" 
                value={datosFormulario.password}
                onFocus = {() => setMostrarRequisitos(true)}
                onBlur={() => setMostrarRequisitos(false)} // Ocultar requisitos cuando se desenfoca
                onChange={(e) => {
                handlerInputChanges(e);
                validarPassword(e.target.value); 
                }}
                />
              <span className="input-group-text" onClick={() => { setPassVisible(!passVisible) }}>
                <img src={passVisible ? "https://www.carrefour.es/nlogin/img/eyeOn.svg" : "https://www.carrefour.es/nlogin/img/eyeOff.svg"} alt="icono boton ojo"></img>
              </span>
            
            </div>
       {/* Validaciones de la contraseña en tiempo real */}
       {mostrarRequisitos && (
  <ul className="small-text">
    <p>La contraseña debe cumplir con los siguientes requisitos:</p>
    <li className={validacionPassword.minLength ? "text-success" : "text-danger"}>Entre 8 y 40 caracteres</li>
    <li className={validacionPassword.hasUpperCase ? "text-success" : "text-danger"}>Al menos una letra mayúscula</li>
    <li className={validacionPassword.hasLowerCase ? "text-success" : "text-danger"}>Al menos una letra minúscula</li>
    <li className={validacionPassword.hasDigit ? "text-success" : "text-danger"}>Al menos un dígito (0-9)</li>
    <li className={validacionPassword.hasSpecialChar ? "text-success" : "text-danger"}>Al menos un carácter especial (ej.: !@.#)</li>
  </ul>
)}

            <div className="input-group mb-3">
              <input type={repassVisible ? "text" : "password"} className="form-control" placeholder="Repetir Contraseña*" name="repassword" onChange={handlerInputChanges} />
              <span className="input-group-text" onClick={() => { setRePassVisible(!repassVisible) }}>
                <img src={repassVisible ? "https://www.carrefour.es/nlogin/img/eyeOn.svg" : "https://www.carrefour.es/nlogin/img/eyeOff.svg"} alt="icono boton ojo"></img>
              </span>
            </div>

            <div className="mb-3">
  <input
          type="text"
          className="form-control"
          placeholder="Código postal (opcional)"
          name="cp"
          onChange={handlerInputChanges}
        />
        {errorCodigoPostal && (
          <div>
            <small className="text-danger">{"   " + errorCodigoPostal}</small>
          </div>
        )}
</div>
            <p className="small-text">Te ofrecemos un surtido más ajustado a tu zona</p>
            <button type="submit" className="btn btn-primary w-100" disabled={!formularioValido}>
              Crear cuenta
            </button>
          </form>
          <p className="login-link">
            ¿Ya tienes una cuenta? <a href="#" className="text-primary" >Iniciar sesión</a>
          </p>
          <p className="legal-text">
            Al crear una cuenta declaro haber leído las{" "}
            <a href="#">bases del Club Carrefour</a>, haber sido informado del tratamiento de mis datos personales según se describen en la{" "}
            <a href="#">Política de Privacidad de los Medios Digitales Carrefour y del Club Carrefour</a> y acepto los{" "}
            <a href="#">términos y condiciones de uso de los Medios Digitales Carrefour</a>.
          </p>

        </div> {/* Cerrando correctamente el div de registro-container */}
      </div> {/* Cerrando correctamente el div de container */}

      <footer className="footer">
        <p>Centros Comerciales Carrefour S.A.</p>
        <a href="#">Cookies</a>
        <a href="#">Aviso legal</a>
        <a href="#">Política de privacidad</a>
      </footer>
    </>
  );

}
export default Registro;