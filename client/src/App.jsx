import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Manager from './components/Manager'
import Footer from './components/Footer'

function App() {
  
  axios.post('https://password-manager-api-snowy.vercel.app/')

  return (
    <>
     <Navbar/>
     <Manager/>
     <Footer/>
    </>
  )
}

export default App
