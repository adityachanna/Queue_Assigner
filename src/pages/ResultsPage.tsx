import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  User, 
  Heart,
  ArrowRight,
  Home
} from 'lucide-react'

interface AssessmentResult {
  risk_level: string
  confidence_score: number
  priority_score: number
  estimated_wait_time: number
  timestamp: string
  details: {
    heart_rate: number
    respiratory_rate: number
    body_temperature: number
    oxygen_saturation: number
    systolic_blood_pressure: number
    diastolic_blood_pressure: number
    age: number
    gender: number
    weight: number
    height: number
    derived_hrv: number
    derived_pulse_pressure: number
    derived_bmi: number
    derived_map: number
  }
}

const ResultsPage: React.FC = () => {
  const location = useLocation()
  const result = location.state?.result as AssessmentResult

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="text-gray-400">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
          <p className="text-gray-600 mb-6">
            Please complete an assessment first to view your results.
          </p>
          <Link to="/assessment" className="btn btn-primary">
            Start Assessment
          </Link>
        </div>
      </div>
    )
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'high':
      case 'high risk':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
          badge: 'bg-red-100 text-red-800'
        }
      case 'medium':
      case 'medium risk':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
          badge: 'bg-yellow-100 text-yellow-800'
        }
      case 'low':
      case 'low risk':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600',
          badge: 'bg-green-100 text-green-800'
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600',
          badge: 'bg-gray-100 text-gray-800'
        }
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

  const colors = getRiskColor(result.risk_level)
  const RiskIcon = getRiskIcon(result.risk_level)

  const vitalSigns = [
    { label: 'Heart Rate', value: `${result.details.heart_rate} bpm`, icon: Heart },
    { label: 'Blood Pressure', value: `${result.details.systolic_blood_pressure}/${result.details.diastolic_blood_pressure} mmHg`, icon: TrendingUp },
    { label: 'Temperature', value: `${result.details.body_temperature}°F`, icon: AlertTriangle },
    { label: 'Oxygen Saturation', value: `${result.details.oxygen_saturation}%`, icon: CheckCircle },
    { label: 'Respiratory Rate', value: `${result.details.respiratory_rate} breaths/min`, icon: Clock },
    { label: 'BMI', value: result.details.derived_bmi.toFixed(1), icon: User },
  ]

  const getRecommendations = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'high':
      case 'high risk':
        return [
          'Seek immediate medical attention',
          'Do not delay - see a healthcare provider now',
          'Monitor vital signs closely',
          'Follow up with your primary care physician'
        ]
      case 'medium':
      case 'medium risk':
        return [
          'Schedule an appointment with your doctor',
          'Monitor your symptoms',
          'Consider lifestyle modifications',
          'Follow up within 1-2 weeks'
        ]
      case 'low':
      case 'low risk':
        return [
          'Continue regular health maintenance',
          'Schedule routine check-ups',
          'Maintain healthy lifestyle habits',
          'Monitor any changes in symptoms'
        ]
      default:
        return ['Consult with a healthcare professional']
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-gray-900">Assessment Results</h1>
        <p className="text-gray-600">
          Completed on {new Date(result.timestamp).toLocaleString()}
        </p>
      </motion.div>

      {/* Risk Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`card ${colors.border} ${colors.bg}`}
      >
        <div className="card-content">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-white ${colors.border} border-2`}>
                <RiskIcon className={`w-8 h-8 ${colors.icon}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Risk Assessment</h2>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`badge ${colors.badge} text-lg px-3 py-1`}>
                    {result.risk_level}
                  </span>
                  <span className="text-sm text-gray-600">
                    Confidence: {(result.confidence_score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Priority Score</div>
              <div className="text-3xl font-bold text-gray-900">
                {result.priority_score.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Queue Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-xl font-semibold text-gray-900">Queue Information</h3>
        </div>
        <div className="card-content">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Estimated Wait Time</h4>
                <p className="text-gray-600">Based on current queue and your priority level</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {result.estimated_wait_time} min
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              You have been added to the queue. Please wait for your turn or check the queue status.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Vital Signs Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-xl font-semibold text-gray-900">Vital Signs Summary</h3>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vitalSigns.map((vital, index) => (
              <div key={vital.label} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <vital.icon className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-sm text-gray-600">{vital.label}</div>
                  <div className="font-semibold text-gray-900">{vital.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-xl font-semibold text-gray-900">Recommendations</h3>
        </div>
        <div className="card-content">
          <ul className="space-y-3">
            {getRecommendations(result.risk_level).map((recommendation, index) => (
              <li key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link to="/queue" className="btn btn-primary">
          <Clock className="w-4 h-4 mr-2" />
          Check Queue Status
        </Link>
        <Link to="/assessment" className="btn btn-secondary">
          <ArrowRight className="w-4 h-4 mr-2" />
          New Assessment
        </Link>
        <Link to="/" className="btn btn-secondary">
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-50 rounded-lg p-6 text-center"
      >
        <p className="text-sm text-gray-600">
          <strong>Disclaimer:</strong> This assessment is for informational purposes only and should not replace professional medical advice. 
          Always consult with a qualified healthcare provider for medical concerns.
        </p>
      </motion.div>
    </div>
  )
}

export default ResultsPage