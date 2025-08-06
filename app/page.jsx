import React from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import FeatureSection from './components/FeatureSection'
import Cards from './components/Cards'
import Footer from './components/Footer'


const page = () => {
  
  return (
    <div>
      <Sidebar/>
      <Header/>
    <FeatureSection/>
    <Cards/>
    <Footer/>
      </div>
  )
}

export default page
