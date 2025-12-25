import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Layout from './Components/Layout.jsx'
import Register from "./Register/Register"
import Login from './Login/Login.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminLogin from './Login/AdminLogin.jsx'
import AddTemplate from './pages/AddTemplate.jsx'
import Editor from './Canvas/Editor.jsx'
import GetStarted from './pages/GetStarted.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { Provider } from 'react-redux';
import {store, persistor} from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import {RouterProvider, createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import About from './pages/About.jsx'
import Templates from './pages/Templates.jsx'
import Users from './pages/Users.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />} >
      <Route path='' element={<GetStarted />} />
      <Route path='/register' element={<Register />} />
      <Route path='/signin' element={<Login />} />
      <Route path='/admin' element={<AdminLogin />} />
      <Route path='/editor' element={<Editor />} />
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/about' element={<About />}/>
      <Route path='/admindashboard' element={<AdminDashboard />}/>
      <Route path='/addtemp' element={<AddTemplate />}/>
      <Route path='/templates' element={<Templates />} />
      <Route path='/users' element={<Users />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor} >
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
