import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  RefreshCw, 
  Trash2, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  BarChart3,
  Settings
} from 'lucide-react'
import { getQueue, clearQueue, updatePriorities } from '../services/api'
import toast from 'react-hot-toast'

interface QueuePatient {
  patient_id: string
  risk_level: string
  confidence_score: number
  priority_score: number
  queue_position: number
  estimated_wait_time: number
  timestamp: string
}

const AdminPage: React.FC = () => {
  const [queue, setQueue] = useState<QueuePatient[]>([])
  const [loading, setLoading] = useState(true)
  const [clearing, setClearing] = useState(false)
  const [updating, setUpdating] = useState(false)

  const fetchQueue = async () => {
    try {
      setLoading(true)
      const queueData = await getQueue()
      setQueue(queueData)
    } catch (error) {
      console.error('Failed to fetch queue:', error)
      toast.error('Failed to fetch queue data')
    } finally {
      setLoading(false)
    }
  }

  const handleClearQueue = async () => {
    if (!window.confirm('Are you sure you want to clear the entire queue? This action cannot be undone.')) {
      return
    }

    try {
      setClearing(true)
      await clearQueue()
      await fetchQueue()
      toast.success('Queue cleared successfully')
    } catch (error) {
      console.error('Failed to clear queue:', error)
      toast.error('Failed to clear queue')
    } finally {
      setClearing(false)
    }
  }

  const handleUpdatePriorities = async () => {
    try {
      setUpdating(true)
      await updatePriorities()
      await fetchQueue()
      toast.success('Priorities updated successfully')
    } catch (error) {
      console.error('Failed to update priorities:', error)
      toast.error('Failed to update priorities')
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    fetchQueue()
  }, [])

  const queueStats = {
    total: queue.length,
    highRisk: queue.filter(p => p.risk_level.toLowerCase().includes('high')).length,
    mediumRisk: queue.filter(p => p.risk_level.toLowerCase().includes('medium')).length,
    lowRisk: queue.filter(p => p.risk_level.toLowerCase().includes('low')).length,
    averageWait: queue.length > 0 ? Math.round(queue.reduce((sum, p) => sum + p.estimated_wait_time, 0) / queue.length) : 0,
    averageConfidence: queue.length > 0 ? (queue.reduce((sum, p) => sum + p.confidence_score, 0) / queue.length * 100) : 0
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage patient queue and system settings
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
          <button
            onClick={handleUpdatePriorities}
            disabled={updating}
            className="btn btn-primary"
          >
            <TrendingUp className={`w-4 h-4 mr-2 ${updating ? 'animate-spin' : ''}`} />
            Update Priorities
          </button>
          <button
            onClick={handleClearQueue}
            disabled={clearing || queue.length === 0}
            className="btn btn-danger"
          >
            <Trash2 className={`w-4 h-4 mr-2 ${clearing ? 'animate-spin' : ''}`} />
            Clear Queue
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">{queueStats.total}</p>
                <p className="text-sm text-gray-500 mt-1">In queue</p>
              </div>
              <Users className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-3xl font-bold text-red-600">{queueStats.highRisk}</p>
                <p className="text-sm text-gray-500 mt-1">Critical patients</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Wait Time</p>
                <p className="text-3xl font-bold text-green-600">{queueStats.averageWait}m</p>
                <p className="text-sm text-gray-500 mt-1">Minutes</p>
              </div>
              <Clock className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Medium Risk</p>
                <p className="text-3xl font-bold text-yellow-600">{queueStats.mediumRisk}</p>
                <p className="text-sm text-gray-500 mt-1">Moderate patients</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Risk</p>
                <p className="text-3xl font-bold text-blue-600">{queueStats.lowRisk}</p>
                <p className="text-sm text-gray-500 mt-1">Stable patients</p>
              </div>
              <Users className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                <p className="text-3xl font-bold text-purple-600">{queueStats.averageConfidence.toFixed(1)}%</p>
                <p className="text-sm text-gray-500 mt-1">Assessment accuracy</p>
              </div>
              <BarChart3 className="w-12 h-12 text-purple-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Queue Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Queue Management</h2>
        </div>
        <div className="card-content">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading queue...</span>
            </div>
          ) : queue.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients in queue</h3>
              <p className="text-gray-600">The queue is currently empty.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Position</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Patient ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Risk Level</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Priority Score</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Confidence</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Wait Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((patient, index) => (
                    <tr key={patient.patient_id} className={`border-b border-gray-100 ${
                      index === 0 ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                          index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {patient.queue_position}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {patient.patient_id}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${
                          patient.risk_level.toLowerCase().includes('high') ? 'badge-danger' :
                          patient.risk_level.toLowerCase().includes('medium') ? 'badge-warning' :
                          'badge-success'
                        }`}>
                          {patient.risk_level}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {patient.priority_score.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {(patient.confidence_score * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {patient.estimated_wait_time}m
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {new Date(patient.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* System Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            System Settings
          </h2>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Queue Management</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-700">Auto-refresh queue every 30 seconds</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-700">Priority boost for elderly patients</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-700">Time-based priority adjustment</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-700">Alert for high-risk patients</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-700">Email notifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-700">Sound alerts</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminPage