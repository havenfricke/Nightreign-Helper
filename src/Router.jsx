import { App } from './App.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import HomePage from './pages/HomePage.jsx';
import { createBrowserRouter } from 'react-router-dom';
import StuffPage from './Pages/StuffPage.jsx';

export const router = createBrowserRouter([
    {
      path: "/Nightreign-Helper/",
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/Nightreign-Helper/",
          element: <HomePage />,
        },
        {
            path:"/Nightreign-Helper/stuff",
            element: <StuffPage />
        }
      ],
    },
  ]);