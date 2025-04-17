import { useLocation, useNavigate } from 'react-router-dom';
import useGlobalStore from '../../../../globalState/storeGlobal';

const Bienvenida = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { codigoVerificacion, jwt, datosCliente } = useGlobalStore();
    console.log("datosCliente:", datosCliente);

    const tarjetaCarrefour = datosCliente.tarjetaCarrefour;
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>¡Bienvenido a Carrefour!</h1>
            <p>Tu tarjeta Carrefour:</p>
            <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', fontSize: '22px', fontWeight: 'bold', letterSpacing: '2px', margin: '20px auto', maxWidth: '300px' }}>
                {tarjetaCarrefour}
            </div>
            <button onClick={() => navigate('/')} style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#0046BE', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Seguir comprando
            </button>
        </div>
    );
}

export default Bienvenida;
