import { useState } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import useGlobalStore from '../../../../../globalState/storeGlobal';
import restTiendaService from '../../../../../servicios/restTiendaService';
import { Offcanvas } from 'bootstrap'; // 👈 Esto importa la clase correctamente

const Header = ({ categorias }) => {
    const { datosCliente } = useGlobalStore();
    const navigate = useNavigate();

    const [subcategorias, setSubcategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [mostrarSubcategorias, setMostrarSubcategorias] = useState(false);

    const [subSubcategorias, setSubSubcategorias] = useState([]);
    const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);
    const [mostrarSubSubcategorias, setMostrarSubSubcategorias] = useState(false);
    


    //  Categorias:
    // 3. Al hacer click en una categoria, llamamos a la funcion manejarClickCategoria
    //  Esta funcion llama al servicio para recuperar las subcategorias de la categoria seleccionada
    const manejarClickCategoria = async (categoria) => {
        try {
            const result = await restTiendaService.Categorias(categoria.pathCategoria);

            console.log("Subcategorías recuperadas:", result);

            // guarda las subcategorias en el estado
            setSubcategorias(result);

            // guarda la categoria seleccionada en el estado
            setCategoriaSeleccionada(categoria);
            
            // muestra las subcategorias
            setMostrarSubcategorias(true);

         

        } catch (error) {
            console.error("Error al cargar las subcategorías:", error);
        }
    };

    //5. recupera las subsubcategorias de la subcategoria seleccionada
    const manejarClickSubcategoria = async (subcategoria) => {
        try {
            const result = await restTiendaService.Categorias(subcategoria.pathCategoria);
    
            console.log("Sub-subcategorías recuperadas:", result);
    
            setSubSubcategorias(result);
            setSubcategoriaSeleccionada(subcategoria);
            setMostrarSubSubcategorias(true);
        } catch (error) {
            console.error("Error al cargar las sub-subcategorías:", error);
        }
    };
    
    const manejarClickSubSubcategoria = (subSubcategoria) => {
        const offcanvasElement = document.getElementById('offcanvasMenu');
        const bsOffcanvas = Offcanvas.getInstance(offcanvasElement);
    
        if (bsOffcanvas) {
            bsOffcanvas.hide();
    
            // Espera a que termine la animación y luego elimina el backdrop
            setTimeout(() => {
                const backdrop = document.querySelector('.offcanvas-backdrop');
                if (backdrop) {
                    backdrop.remove(); // ❌ Adiós fondo negro
                    document.body.classList.remove('offcanvas-backdrop', 'show'); // Limpieza extra
                    document.body.style.overflow = ''; // Evita scroll bloqueado
                }
            }, 300); // iguala el tiempo del fade-out de Bootstrap (puedes ajustar si es necesario)
        }
    
        navigate(`/Tienda/Productos/${subSubcategoria.pathCategoria}`);
    };
    

    // resetCategorias es una funcion que se llama al cerrar el off-canvas
    const resetCategorias = () => {

        // borramos la categoria seleccionada
        setCategoriaSeleccionada(null);

        // Limpiamos el estado de subcategorias al cerrar el off-canvas
        setSubcategorias([]);

        // oculta las subcategorias
        setMostrarSubcategorias(false); 

        setSubcategoriaSeleccionada(null); // Resetea la subcategoría seleccionada
        
        setSubSubcategorias([])
        
        setMostrarSubSubcategorias(false); // Oculta las sub-subcategorías
    };


    // Recuperar productos de la categoria seleccionada

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-white navbar-light">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    {/* Left Section: Logo and Menu */}
                    <div className="d-flex align-items-center">
                        <Link className="navbar-brand" to="/">
                            <img 
                                src="https://www.carrefour.es/myaccount/assets/images/logos/logo.svg" 
                                alt="Carrefour Logo" 
                                className="carrefour-logo" 
                            />
                        </Link>
                        <button 
                            className="botonmenu" 
                            type="button" 
                            data-bs-toggle="offcanvas" 
                            data-bs-target="#offcanvasMenu"
                            onClick={resetCategorias}
                        >
                            ☰ Menú
                        </button>
                        <Link className="nav-link" to="/Folletos">Folletos</Link>
                    </div>

                    {/* Center Section: Search Bar */}
                    <div className="search-bar">
                        <input type="text" placeholder="Buscar en todo Carrefour" />
                        <button className="search-bar__search-actions">
                            <i className="fa fa-search"></i>
                        </button>
                    </div>

                    {/* Right Section: Links */}
                    <div className="d-flex align-items-center justify-content-end">
         
                        <Link className="nav-link" to="/Ayuda">Ayuda y contacto</Link>
                        <Link className="nav-link" to="/Listas">Listas y Mis productos</Link>
                        <Link className="nav-link" to="/Cliente/Login">
                                Mi cuenta
                        </Link>
                        <Link className="nav-link" to="/Tienda/MostrarPedido">
                            <i className="fa-solid fa-cart-shopping"></i> Cesta
                        </Link>
                    </div>
                </div>
            </nav>

            {/* New Section: Recogida Drive and Envío a domicilio */}
            <div className="delivery-options d-flex justify-content-center align-items-center">
                <div className="delivery-option">
                <img src="https://www.carrefour.es/dist/rendering/home-front/drive-active.svg?4af2d8b4514b12490f55394ba3288795" alt="Envío a domicilio" className="delivery-icon" />
                <span>Recogida Drive</span>
                </div>  
                <div className="delivery-option">
                    <img src="https://www.carrefour.es/dist/rendering/home-front/delivery-active.svg?5f27c5a9174a0fdcfd449b25cd9735a7" alt="Envío a domicilio" className="delivery-icon" />
                    <span>Envío a domicilio</span>
                </div>
            </div>

            <div 
                className="offcanvas offcanvas-start wide-offcanvas" 
                tabIndex="-1" 
                id="offcanvasMenu" 
                aria-labelledby="offcanvasMenuLabel"
                onHide={resetCategorias} // Reset state when the off-canvas is closed
            >
                <div className="offcanvas-header">
                <Link className="navbar-brand" to="/">
                            <img 
                                src="https://www.carrefour.es/myaccount/assets/images/logos/logo.svg" 
                                alt="Carrefour Logo" 
                                className="carrefour-logo" 
                            />
                        </Link>                    <button 
                        type="button" 
                        className="btn-close" 
                        data-bs-dismiss="offcanvas" 
                        aria-label="Cerrar"
                        onClick={resetCategorias} // Reset state when closing the off-canvas
                    ></button>
                </div>

                <div className="offcanvas-body d-flex">
                    {/* Main Categories */}
                    <ul className="list-group main-categories flex-grow-1">
                        {/* // 2. Muestra las categorias principales, cada categoria tiene unm onClick
                         que llama a manejarClickCategoria */}
                        {categorias.map((categoria, index) => (
                            <li 
                                key={index} 
                                className={`list-group-item d-flex align-items-center justify-content-between categoria-item ${categoriaSeleccionada === categoria ? 'active' : ''}`}
                                onClick={() => manejarClickCategoria(categoria)}
                            >
                                <div className="d-flex align-items-center">
                                    <img src={categoria.imagen} alt={categoria.nombreCategoria} width="50" className="me-2" />
                                    <span>{categoria.nombreCategoria}</span>
                                </div>
                                <i className="fa-solid fa-chevron-right"></i>
                            </li>
                        ))}
                    </ul>

                    {/* Subcategories */}
                    <div className={`subcategories-panel flex-grow-1 ${mostrarSubcategorias ? 'd-block' : 'd-none'}`}>
                        <div className="d-flex align-items-center mb-3">
                            <button className="btn btn-link me-2 p-0" onClick={resetCategorias}>
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            {categoriaSeleccionada && (
                                <img 
                                    src={categoriaSeleccionada.imagen} 
                                    alt={categoriaSeleccionada.nombreCategoria} 
                                    width="50" 
                                    className="me-2" 
                                    style={{ marginLeft: '0' }} // Elimina margen adicional
                                />
                            )}
                            <h7 className="mb-0" style={{ marginLeft: '0' }}>{categoriaSeleccionada?.nombreCategoria || "Subcategorías"}</h7>
                        </div>

                        {/* List of subcategories */}
                        <ul className="list-group">
                            {subcategorias.map((sub, idx) => (
                                <li key={idx} className="list-group-item" onClick={() => manejarClickSubcategoria(sub)}>
                                    <Link to={`/Categoria/${sub.pathCategoria}`} className="text-decoration-none text-dark">
                                        {sub.nombreCategoria}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                        
                    {/* Sub-Subcategories */}
                    <div 
                        className={`sub-subcategories-panel flex-grow-1 ${mostrarSubSubcategorias ? 'd-block' : 'd-none'}`} 
                        style={{ marginTop: '-21px' }} // Ajusta la altura del canvas
                    >
                        <div className="d-flex align-items-center mb-3">
                            <button className="btn btn-link me-2 p-0" onClick={resetCategorias}>
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                        </div>

                        {/* Subcategory name displayed above the list */}
                        <h6 className="mb-3">{subcategoriaSeleccionada?.nombreCategoria || "Sub-subcategorías"}</h6>

                        {/* List of sub-subcategories */}
                        <ul className="list-group"                         style={{ marginTop: '30px' }} // Ajusta la altura del canvas
                        >
                            {subSubcategorias.map((subSub, idx) => (
                                <li key={idx} className="list-group-item" onClick={() => manejarClickSubSubcategoria(subSub)}>
                                    {subSub.nombreCategoria}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

        </>

    );
};

export default Header;
