import React from "react";
import './Home.css'

const Home=()=>{
    return (
        <div className="container mt-4 mb-5">
            <div className="row mb-3">
                <img src="images/home_promos.png" alt=""/>
            </div>
            <div className="row">
                <h3>¿Por qué comprar en el Supermercado y Tienda Online de Carrefour?</h3>
                <p>En Carrefour somos conscientes de que tener la posibilidad de hacer la compra en nuestro supermercado&nbsp;y en nuestra tienda online sin tener que moverte de casa es una gran ventaja. Con solo unos clics, es posible llenar tu carrito hasta conseguir el pedido online perfecto y recibir todos los productos que necesitas directamente en la puerta de tu casa. Anímate a descubrir las ofertas y promociones de la tienda online de Carrefour y realiza tu primera compra con este&nbsp;<a href="https://www.carrefour.es/supermercado/condiciones/cupon-bienvenida.e"><strong>cupón de descuento</strong></a><strong>&nbsp;</strong>en nuestro&nbsp;supermercado online.&nbsp;</p>
                
                <h3>¿Cómo funcionan los envíos de Carrefour Online?</h3>
                <p>Queremos que tus compras online sean sencillas y rápidas. Por eso ponemos a tu disposición un servicio de&nbsp;<a href="http://www.carrefour.es/servicios/entrega-recogida-pedidos.e"><strong>entrega de pedidos a domicilio</strong></a>&nbsp;de lo más eficaz. Para empezar, podrás tener tu compra de supermercado online en tan solo <strong>24 horas </strong>o&nbsp;recoger tu pedido del súper online en&nbsp;tu tienda más cercana sin bajarte del coche con el servicio&nbsp;<strong>Drive.</strong>&nbsp;También&nbsp;te ofrecemos la posibilidad de poder recoger tus pedidos online en tiendas seleccionadas en tan solo 2 horas con el servicio&nbsp;<strong>Click &amp; Collect </strong>o que te lleguen a casa rápidamente con nuestro <strong>envío en 4 horas</strong>. ¿A qué esperas? ¡Empieza ya a hacer tu compra en Carrefour!</p>
            </div>

            <div className="row">
                <div className="pre-footer">
                    <div className="pre-footer__item">
                        <a href="https://www.carrefour.es/servicios/entrega-recogida-pedidos.e" rel="nofollow" className="pre-footer__title">
                            <i className="fa-solid fa-truck-fast"></i>  Entrega y recogida de pedidos
                        </a>
                    </div>
                    <div className="pre-footer__item">
                        <a href="https://www.carrefour.es/supermercado/servicios/garantia-de-frescura.e" rel="nofollow" className="pre-footer__title">
                            <i className="fa-solid fa-leaf"></i> Garantía de frescura
                        </a>
                    </div>
                    <div className="pre-footer__item">
                        <a href="https://www.pass.carrefour.es/financiacion?utm_source=prefooter&amp;utm_medium=enlace_web&amp;utm_campaign=carrefoures" rel="nofollow" className="pre-footer__title">
                            <i className="fa-solid fa-credit-card"></i> Financiación con Tarjeta PASS
                        </a>
                    </div>
                    <div className="pre-footer__item">
                        <a href="https://www.carrefour.es/servicios/apps-carrefour.e" rel="nofollow" className="pre-footer__title">
                            <i className="fa-solid fa-mobile-screen-button"></i> Apps Carrefour
                    </a>
                    </div>
                </div>
            </div>
        </div>        
    )
}

export default Home;