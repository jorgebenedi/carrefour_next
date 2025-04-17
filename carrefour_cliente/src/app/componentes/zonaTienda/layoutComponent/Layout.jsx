import './Layout.css';
import { Outlet } from 'react-router-dom';
import Header from './headerComponent/Header';
import Footer from './footerComponent/Footer';
import {  useLoaderData } from 'react-router-dom';

// si tienes los datos del cliente has hecho login --> 
// recuperar los datos del cliente aquí y pasarlos al header
const Layout = () => {

  // 6. Despues de llamar al backend , recibes un array de categorias que cargaras en el header
  const categorias = useLoaderData(); // ← Aquí tienes las categorías del loader

  return (
    
    <div className="container-fluid">
      <div className="row">
        <div className="col">
     
          {/* // 7. Pasar las categorias al header para que las muestre */}
          <Header categorias={categorias}/>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Outlet /> {/* Renderizar rutas hijas */}
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;