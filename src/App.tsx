import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/home'
import Layout from './components/layout'
import Profile from './components/profile'
import Login from './components/login'
import CreateAccount from './components/create-account'
import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      children: [
        {
          path: "",
          element: <Home />
        },
        {
          path: "profile",
          element: <Profile/>
        }
      ]
      },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: "/create-account",
      element: <CreateAccount/>
    }
  ])

  const GlobalStyles = createGlobalStyle`
    ${reset};
    * {
      box-sizing: border-box;
    }

    body {
      background-color: black;
      color:white;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
  `;

  return (
    <>
      <GlobalStyles />
      <RouterProvider router={router} />
    </>
  )
}

export default App
