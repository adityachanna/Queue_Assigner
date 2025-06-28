import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  User,
  Calendar,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { getQueue, getNextPatient } from '../services/api'

interface QueuePatient {
  patient_id: string
  risk_level: string
  confidence_score: number
  priority_score: number
  queue_position: number
  estimated_wait_time: number
  timestamp: string
}

const QueuePage: React.FC = () => {
  const [queue, setQueue] = useState<QueuePatient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchQueue = async () => {
    try {
      setLoading(true)
      setError(null)
      const queueData = await getQueue()
      setQueue(queueData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch queue:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch queue'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleNextPatient = async () => {
    try {
      setError(null)
      await getNextPatient()
      await fetchQueue() // Refresh queue after removing patient
    } catch (error) {
      console.error('Failed to get next patient:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to get next patient'
      setError(errorMessage)
    }
  }

  useEffect(() => {
    fetchQueue()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchQueue, 30000)
    return () => clearInterval(interval)
  }, [])

  const getRiskBadgeClass = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'high':
      case 'high risk':
        return 'badge-danger'
      case 'medium':
      case 'medium risk':
        return 'badge-warning'
      case 'low':
      case 'low risk':
        return 'badge-success'
      default:
        return 'badge-success'
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'high':
      case 'high risk':
        return AlertTriangle
      case 'medium':
      case 'medium risk':
        return Clock
      case 'low':
      case 'low risk':
        return CheckCircle
      default:
        return CheckCircle
    }
  }

  const queueStats = {
    total: queue.length,
    highRisk: queue.filter(p => p.risk_level.toLowerCase().includes('high')).length,
    mediumRisk: queue.filter(p => p.risk_level.toLowerCase().includes('medium')).length,
    lowRisk: queue.filter(p => p.risk_level.toLowerCase().includes('low')).length,
    averageWait: queue.length > 0 ? Math.round(queue.reduce((sum, p) => sum + p.estimated_wait_time, 0) / queue.length) : 0
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Queue</h1>
          <p className="text-gray-600 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchQueue}
            disabled={loading}
            className="btn btn-secondary"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {queue.length > 0 && (
            <button
              onClick={handleNextPatient}
              className="btn btn-primary"
            >
              <User className="w-4 h-4 mr-2" />
              Next Patient
            </button>
          )}
        </div>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <p className="text-xs text-red-600 mt-2">
                Please ensure the backend server is running on the correct protocol and port.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{queueStats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-red-600">{queueStats.highRisk}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Medium Risk</p>
                <p className="text-2xl font-bold text-yellow-600">{queueStats.mediumRisk}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Wait</p>
                <p className="text-2xl font-bold text-green-600">{queueStats.averageWait}m</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Queue List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Current Queue</h2>
        </div>
        <div className="card-content">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading queue...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load queue</h3>
              <p className="text-gray-600 mb-4">There was an error connecting to the backend server.</p>
              <button
                onClick={fetchQueue}
                className="btn btn-primary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
            </div>
          ) : queue.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients in queue</h3>
              <p className="text-gray-600">The queue is currently empty.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {queue.map((patient, index) => {
                const RiskIcon = getRiskIcon(patient.risk_level)
                return (
                  <motion.div
                    key={patient.patient_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      index === 0 
                        ? 'border-blue-200 bg-blue-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <span className="font-semibold">{patient.queue_position}</span>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-gray-900">
                              {patient.patient_id}
                            </h3>
                            <span className={`badge ${getRiskBadgeClass(patient.risk_level)}`}>
                              <RiskIcon className="w-3 h-3 mr-1" />
                              {patient.risk_level}
                            </span>
                            {index === 0 && (
                              <span className="badge bg-blue-100 text-blue-800">
                                Next
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              Priority: {patient.priority_score.toFixed(1)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              Wait: {patient.estimated_wait_time}m
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(patient.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-600">Confidence</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {(patient.confidence_score * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default QueuePage