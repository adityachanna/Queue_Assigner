import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AssessmentPage from './pages/AssessmentPage'
import QueuePage from './pages/QueuePage'
import ResultsPage from './pages/ResultsPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </motion.div>
    </Layout>
  )
}

export default App