import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Registro from './app/componentes/zonaCliente/registroComponent/Registro';
import Layout from './app/componentes/zonaTienda/layoutComponent/Layout';
import Home from './app/componentes/zonaTienda/homeComponent/home';
import Login from './app/componentes/zonaCliente/loginComponent/Login';
import Verificar2FAcode from './app/componentes/zonaCliente/verificarComponent/Verificar2FAcode';
import Bienvenida from './app/componentes/zonaCliente/bienvenidaComponent/Bienvenida';
import Productos from './app/componentes/zonaTienda/productosComponent/Productos';
import restTiendaService from './servicios/restTiendaService';

const routerObject = createBrowserRouter([
  {
    element: <Layout />,
    loader: () => restTiendaService.Categorias(),
    children: [
      { path: '/', element: <Home /> },
      {
        path: '/Tienda',
        children: [
          { path: 'Productos/:pathCat', element: <Productos />, loader: restTiendaService.Productos },
          { path: 'Productos', element: <Productos /> }, // Default route for Productos without :pathCat
        ],
      },
    ],
  },
  {
    path: '/Cliente',
    children: [
      { path: 'Login', element: <Login /> },
      { path: 'Registro', element: <Registro /> },
      { path: 'Verificar/:operacion', element: <Verificar2FAcode /> },
      { path: 'Bienvenida', element: <Bienvenida /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={routerObject} />
    </>
  );
}

export default App;
