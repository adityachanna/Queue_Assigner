import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Users, 
  Activity, 
  ArrowRight,
  Shield,
  Clock,
  TrendingUp
} from 'lucide-react'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Heart,
      title: 'Health Assessment',
      description: 'Quick and accurate vital signs analysis with AI-powered risk prediction',
      color: 'text-red-600 bg-red-100',
    },
    {
      icon: Users,
      title: 'Smart Queue Management',
      description: 'Priority-based scheduling ensures critical patients are seen first',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Live tracking of patient status and queue updates',
      color: 'text-green-600 bg-green-100',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'HIPAA-compliant data handling with advanced security measures',
      color: 'text-purple-600 bg-purple-100',
    },
  ]

  const stats = [
    { label: 'Patients Assessed Today', value: '127', icon: Users },
    { label: 'Average Wait Time', value: '12 min', icon: Clock },
    { label: 'Risk Accuracy', value: '94.2%', icon: TrendingUp },
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              HealthKiosk
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced health risk assessment system with intelligent queue management. 
            Get your vital signs checked and receive priority-based care scheduling.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/assessment"
            className="btn btn-primary text-lg px-8 py-4 group"
          >
            Start Health Assessment
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/queue"
            className="btn btn-secondary text-lg px-8 py-4"
          >
            View Current Queue
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {stats.map((stat, index) => (
          <div key={stat.label} className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Advanced Healthcare Technology
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our system combines machine learning with healthcare expertise to provide 
            accurate risk assessments and efficient patient management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className="card hover:shadow-lg transition-shadow duration-300"
            >
              <div className="card-content">
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-center text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-6 opacity-90">
          Take control of your health with our advanced assessment system
        </p>
        <Link
          to="/assessment"
          className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Begin Assessment Now
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </motion.div>
    </div>
  )
}

export default HomePage