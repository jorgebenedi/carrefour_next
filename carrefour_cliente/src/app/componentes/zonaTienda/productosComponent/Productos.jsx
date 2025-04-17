import './Productos.css'
import { useLoaderData, useNavigate } from 'react-router-dom'

const Productos=()=>{
    const productos=useLoaderData();
    const navigate=useNavigate();

    return (
        <div className="container mt-4">
         {/* Listado de productos */}
         <div className="row m-4">
            <div className="col-md-2">Filtros...</div>

            <div className="col-md-10 d-flex flex-row">
                {
                    productos && productos.map( 
                                            product => (             
                                                            <div key={product._id}  className="card mb-3" style={{"width": "15rem"}} >
                                                                <div className="d-flex flex-row contenedor">
                                                                    <img src={ product.imágenes[0] } className="img-fluid rounded-start"  style={{"width":"170px","height":"170px"}} alt={ product.nombre } />
                                                                    {/* el icono cuando se clickea del corazon seria:  <i className="fa-solid fa-heart"></i> */}
                                                                    <button type="button" className="boton"><i className="fa-regular fa-heart"></i></button>
                                                                </div>
                                                                <div className="card-body d-flex flex-column justify-content-between" style={{ "cursor":"pointer"}} onClick={()=>navigate(`/Tienda/Producto/${product._id}`)}>
                                                                    <div>
                                                                        <h3 className="card-title">{ product.precio } €</h3>
                                                                        <h5 className="card-text text-body-secondary">{ product.precioKg } €/Kg</h5>
                                                                        <p className='card-text'><strong>{ product.nombre}</strong></p>
                                                                    </div>
                                                                    <div>
                                                                        <button  type="button" className="btn btn-primary addToCart">Añadir</button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                      
                                            )   
                                    )   
                }

            </div>
        </div>           
        </div>
    )
}

export default Productos;