import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { 
  Heart, 
  Thermometer, 
  Activity, 
  User, 
  Weight, 
  Ruler,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { submitAssessment } from '../services/api'

interface VitalSignsForm {
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

const AssessmentPage: React.FC = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<VitalSignsForm>({
    defaultValues: {
      Gender: 0,
      Derived_HRV: 45.0,
    }
  })

  const watchedValues = watch()

  // Calculate derived values automatically
  React.useEffect(() => {
    const { Weight_kg, Height_m, Systolic_Blood_Pressure, Diastolic_Blood_Pressure } = watchedValues

    if (Weight_kg && Height_m) {
      const bmi = Weight_kg / (Height_m * Height_m)
      setValue('Derived_BMI', Number(bmi.toFixed(1)))
    }

    if (Systolic_Blood_Pressure && Diastolic_Blood_Pressure) {
      const pulsePress = Systolic_Blood_Pressure - Diastolic_Blood_Pressure
      const map = Diastolic_Blood_Pressure + (pulsePress / 3)
      setValue('Derived_Pulse_Pressure', Number(pulsePress.toFixed(1)))
      setValue('Derived_MAP', Number(map.toFixed(1)))
    }
  }, [watchedValues, setValue])

  const steps = [
    {
      title: 'Personal Information',
      icon: User,
      fields: ['Age', 'Gender', 'Weight_kg', 'Height_m']
    },
    {
      title: 'Vital Signs',
      icon: Heart,
      fields: ['Heart_Rate', 'Respiratory_Rate', 'Body_Temperature', 'Oxygen_Saturation']
    },
    {
      title: 'Blood Pressure',
      icon: Activity,
      fields: ['Systolic_Blood_Pressure', 'Diastolic_Blood_Pressure', 'Derived_HRV']
    }
  ]

  const onSubmit = async (data: VitalSignsForm) => {
    setIsSubmitting(true)
    try {
      const result = await submitAssessment(data)
      toast.success('Assessment completed successfully!')
      navigate('/results', { state: { result } })
    } catch (error) {
      toast.error('Failed to submit assessment. Please try again.')
      console.error('Assessment error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderField = (fieldName: keyof VitalSignsForm, label: string, unit?: string, type: string = 'number') => {
    const isRequired = !fieldName.startsWith('Derived_')
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {unit && <span className="text-gray-500">({unit})</span>}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        {fieldName === 'Gender' ? (
          <select
            {...register(fieldName, { required: isRequired })}
            className="input"
          >
            <option value={0}>Female</option>
            <option value={1}>Male</option>
          </select>
        ) : (
          <input
            type={type}
            step={type === 'number' ? '0.1' : undefined}
            {...register(fieldName, { 
              required: isRequired,
              min: 0,
              valueAsNumber: type === 'number'
            })}
            className="input"
            readOnly={fieldName.startsWith('Derived_')}
          />
        )}
        {errors[fieldName] && (
          <p className="text-sm text-red-600">This field is required</p>
        )}
      </div>
    )
  }

  const renderStep = () => {
    const step = steps[currentStep]
    
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('Age', 'Age', 'years')}
            {renderField('Gender', 'Gender')}
            {renderField('Weight_kg', 'Weight', 'kg')}
            {renderField('Height_m', 'Height', 'm')}
            {watchedValues.Weight_kg && watchedValues.Height_m && (
              <div className="md:col-span-2">
                {renderField('Derived_BMI', 'BMI (Calculated)', 'kg/m²')}
              </div>
            )}
          </div>
        )
      
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('Heart_Rate', 'Heart Rate', 'bpm')}
            {renderField('Respiratory_Rate', 'Respiratory Rate', 'breaths/min')}
            {renderField('Body_Temperature', 'Body Temperature', '°F')}
            {renderField('Oxygen_Saturation', 'Oxygen Saturation', '%')}
          </div>
        )
      
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('Systolic_Blood_Pressure', 'Systolic Blood Pressure', 'mmHg')}
            {renderField('Diastolic_Blood_Pressure', 'Diastolic Blood Pressure', 'mmHg')}
            {renderField('Derived_HRV', 'Heart Rate Variability', 'ms')}
            {watchedValues.Systolic_Blood_Pressure && watchedValues.Diastolic_Blood_Pressure && (
              <>
                {renderField('Derived_Pulse_Pressure', 'Pulse Pressure (Calculated)', 'mmHg')}
                {renderField('Derived_MAP', 'Mean Arterial Pressure (Calculated)', 'mmHg')}
              </>
            )}
          </div>
        )
      
      default:
        return null
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
        <h1 className="text-3xl font-bold text-gray-900">Health Risk Assessment</h1>
        <p className="text-lg text-gray-600">
          Please provide your vital signs and personal information for accurate risk analysis
        </p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                index <= currentStep
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <div className="ml-2 hidden sm:block">
                <p className={`text-sm font-medium ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">
            {steps[currentStep].title}
          </h2>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {renderStep()}
            
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="btn btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Assessment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
        <p className="text-blue-700">
          If you're unsure about any measurements, please ask a healthcare professional for assistance. 
          Accurate vital signs are crucial for proper risk assessment.
        </p>
      </motion.div>
    </div>
  )
}

export default AssessmentPage