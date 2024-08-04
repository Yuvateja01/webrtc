import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Route,BrowserRouter,Routes} from "react-router-dom"
import {Sender} from "./components/Sender"
import {Receiver} from "./components/Receiver"
import './App.css'

function App() {
  return (<BrowserRouter>
  <Routes>
    <Route path="/sender" element={<Sender/>}></Route>
    <Route path="/receiver" element={<Receiver/>}></Route>
  </Routes>
  </BrowserRouter>)

 
}

export default App
