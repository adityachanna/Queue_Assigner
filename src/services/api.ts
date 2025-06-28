import axios from 'axios'

// Configure base URL for the FastAPI backend
// Use relative URL if in production, or localhost for development
const getApiBaseUrl = () => {
  // If we're in development and the current page is HTTPS, use HTTPS for API too
  if (window.location.protocol === 'https:' && window.location.hostname === 'localhost') {
    return 'https://127.0.0.1:8002'
  }
  // If we're in development and the current page is HTTP, use HTTP for API
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8002'
  }
  // For production, use relative URLs
  return '/api'
}

const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.baseURL}${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout')
      throw new Error('Request timeout - please check if the backend server is running')
    }
    if (error.message === 'Network Error') {
      console.error('Network Error - possible CORS or protocol mismatch')
      throw new Error('Cannot connect to backend server. Please ensure the backend is running and accessible.')
    }
    if (error.response) {
      // Server responded with error status
      console.error('Server error:', error.response.status, error.response.data)
      throw new Error(`Server error: ${error.response.status}`)
    }
    throw error
  }
)

// Types
export interface VitalSignsData {
  Heart_Rate: number
  Respiratory_Rate: number
  Body_Temperature: number
  Oxygen_Saturation: number
  Systolic_Blood_Pressure: number
  Diastolic_Blood_Pressure: number
  Age: number
  Gender: number
  Weight_kg: number
  Height_m: number
  Derived_HRV: number
  Derived_Pulse_Pressure: number
  Derived_BMI: number
  Derived_MAP: number
}

export interface AssessmentResult {
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

export interface QueuePatient {
  patient_id: string
  risk_level: string
  confidence_score: number
  priority_score: number
  queue_position: number
  estimated_wait_time: number
  timestamp: string
}

// API Functions
export const submitAssessment = async (data: VitalSignsData): Promise<AssessmentResult> => {
  try {
    const response = await api.post('/predict/', data)
    return response.data
  } catch (error) {
    console.error('Error submitting assessment:', error)
    throw error
  }
}

export const getQueue = async (): Promise<QueuePatient[]> => {
  try {
    const response = await api.get('/queue/')
    return response.data
  } catch (error) {
    console.error('Error fetching queue:', error)
    throw error
  }
}

export const getNextPatient = async (): Promise<QueuePatient> => {
  try {
    const response = await api.get('/queue/next/')
    return response.data
  } catch (error) {
    console.error('Error getting next patient:', error)
    throw error
  }
}

export const clearQueue = async (): Promise<void> => {
  try {
    await api.delete('/queue/clear/')
  } catch (error) {
    console.error('Error clearing queue:', error)
    throw error
  }
}

export const updatePriorities = async (): Promise<void> => {
  try {
    await api.post('/queue/update-priorities/')
  } catch (error) {
    console.error('Error updating priorities:', error)
    throw error
  }
}

export const provideFeedback = async (
  patientId: string,
  actualWaitTime: number,
  satisfactionScore: number,
  resourceUtilization: number = 0.5
): Promise<void> => {
  try {
    await api.post('/feedback/', null, {
      params: {
        patient_id: patientId,
        actual_wait_time: actualWaitTime,
        satisfaction_score: satisfactionScore,
        resource_utilization: resourceUtilization,
      },
    })
  } catch (error) {
    console.error('Error providing feedback:', error)
    throw error
  }
}

export default api