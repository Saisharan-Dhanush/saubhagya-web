/**
 * SAUBHAGYA - Services Page
 * Platform Modules and Business Solutions
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building,
  Factory,
  Shield,
  Truck,
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  Phone,
  Mail,
  Wifi,
  Smartphone,
  Cloud,
  Activity,
  Target,
  Globe,
  Calendar,
  MapPin,
  PhoneCall,
  Star,
  Sparkles,
  ThumbsUp,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function ServicesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const services = [
    {
      id: 'gaushala',
      category: 'Rural Management',
      icon: <Building className="h-12 w-12" />,
      emoji: '🐄',
      title: 'GauShala Management',
      subtitle: 'Cattle & Raw Material Management',
      description: 'Complete digital solution for livestock management, health monitoring, and dung collection optimization with RFID integration.',
      features: [
        'RFID-based cattle identification and tracking',
        'Health monitoring and vaccination management',
        'Automated dung collection scheduling',
        'Digital payment processing for farmers',
        'Real-time livestock location tracking',
        'Feed management and nutrition optimization'
      ],
      benefits: [
        'Increase farmer income by 40%',
        'Reduce animal mortality by 25%',
        'Optimize collection efficiency by 60%',
        'Enable transparent pricing'
      ],
      targetAudience: 'Farmers, Field Workers, Livestock Supervisors',
      technology: ['IoT Sensors', 'RFID Tags', 'Mobile Apps', 'GPS Tracking'],
      pricing: 'Custom pricing based on herd size'
    },
    {
      id: 'biogassangh',
      category: 'Production',
      icon: <Factory className="h-12 w-12" />,
      emoji: '🏭',
      title: 'BiogasSangh Operations',
      subtitle: 'Production Cluster Management',
      description: 'Advanced biogas production monitoring with IoT integration, batch management, and process optimization for maximum efficiency.',
      features: [
        'Real-time production monitoring',
        'Automated batch management',
        'Process optimization algorithms',
        'Maintenance scheduling and alerts',
        'Quality control and testing',
        'Production forecasting'
      ],
      benefits: [
        'Increase production efficiency by 35%',
        'Reduce operational costs by 25%',
        'Minimize downtime by 50%',
        'Ensure consistent quality'
      ],
      targetAudience: 'Plant Operators, Production Managers, Engineers',
      technology: ['IoT Monitoring', 'AI Analytics', 'Process Control', 'Cloud Computing'],
      pricing: 'Enterprise plans starting ₹50,000/month'
    },
    {
      id: 'shuddhidoot',
      category: 'Quality Control',
      icon: <Shield className="h-12 w-12" />,
      emoji: '🛡️',
      title: 'ShuddhiDoot Purification',
      subtitle: 'Gas Quality Control & Monitoring',
      description: 'Comprehensive gas purification monitoring system ensuring highest quality standards and regulatory compliance.',
      features: [
        'CH4 concentration monitoring',
        'Automated quality testing',
        'Regulatory compliance tracking',
        'Process parameter optimization',
        'Equipment maintenance management',
        'Quality certification generation'
      ],
      benefits: [
        'Achieve 99% purity standards',
        'Ensure regulatory compliance',
        'Reduce waste by 30%',
        'Automate quality processes'
      ],
      targetAudience: 'Quality Analysts, Compliance Officers, Lab Technicians',
      technology: ['Gas Analyzers', 'Automated Testing', 'Lab Integration', 'Compliance Tracking'],
      pricing: 'Professional plans starting ₹30,000/month'
    },
    {
      id: 'urjavyapar',
      category: 'Sales',
      icon: <TrendingUp className="h-12 w-12" />,
      emoji: '💼',
      title: 'UrjaVyapar Sales',
      subtitle: 'CBG Sales & Distribution Management',
      description: 'Complete sales management platform for CBG distribution with customer management, pricing optimization, and contract handling.',
      features: [
        'Customer relationship management',
        'Dynamic pricing optimization',
        'Contract management and tracking',
        'Order processing automation',
        'Inventory management',
        'Sales analytics and reporting'
      ],
      benefits: [
        'Increase sales revenue by 45%',
        'Optimize pricing strategies',
        'Improve customer satisfaction',
        'Streamline operations'
      ],
      targetAudience: 'Sales Teams, Account Managers, Distribution Partners',
      technology: ['CRM Integration', 'Pricing Algorithms', 'Mobile Sales Apps', 'Analytics Dashboard'],
      pricing: 'Growth plans starting ₹25,000/month'
    },
    {
      id: 'transport',
      category: 'Logistics',
      icon: <Truck className="h-12 w-12" />,
      emoji: '🚛',
      title: 'Transport Management',
      subtitle: 'Logistics & Delivery Optimization',
      description: 'AI-powered logistics platform for route optimization, delivery tracking, and fleet management with real-time monitoring.',
      features: [
        'Route optimization algorithms',
        'Real-time GPS tracking',
        'Delivery scheduling automation',
        'Fleet management and maintenance',
        'Driver management system',
        'Cost optimization analytics'
      ],
      benefits: [
        'Reduce delivery costs by 30%',
        'Improve delivery time by 40%',
        'Optimize fleet utilization',
        'Enhance customer service'
      ],
      targetAudience: 'Logistics Coordinators, Fleet Managers, Drivers',
      technology: ['GPS Tracking', 'Route Optimization AI', 'Mobile Apps', 'Fleet Telematics'],
      pricing: 'Logistics plans starting ₹20,000/month'
    },
    {
      id: 'urjaneta',
      category: 'Analytics',
      icon: <BarChart3 className="h-12 w-12" />,
      emoji: '📊',
      title: 'UrjaNeta Analytics',
      subtitle: 'Executive Business Intelligence',
      description: 'Advanced analytics platform providing strategic insights, predictive analytics, and voice-enabled business intelligence for executives.',
      features: [
        'Voice-enabled analytics queries',
        'Predictive business modeling',
        'Carbon credit tracking',
        'ESG compliance monitoring',
        'Strategic planning tools',
        'Executive dashboards'
      ],
      benefits: [
        'Data-driven decision making',
        'Predict market trends',
        'Optimize carbon revenue',
        'Strategic competitive advantage'
      ],
      targetAudience: 'Executives, Senior Managers, Strategic Planners',
      technology: ['AI/ML Analytics', 'Voice Recognition', 'Predictive Modeling', 'Business Intelligence'],
      pricing: 'Executive plans starting ₹1,00,000/month'
    },
    {
      id: 'urjasanyojak',
      category: 'Development',
      icon: <Target className="h-12 w-12" />,
      emoji: '🎯',
      title: 'UrjaSanyojak Development',
      subtitle: 'Business Development & Expansion',
      description: 'Comprehensive business development platform for feasibility analysis, expansion planning, and new market development.',
      features: [
        'Feasibility analysis tools',
        'Market research and analysis',
        'Expansion planning modules',
        'ROI calculation and modeling',
        'Stakeholder management',
        'Project tracking and monitoring'
      ],
      benefits: [
        'Accelerate market expansion',
        'Reduce investment risks',
        'Optimize resource allocation',
        'Strategic growth planning'
      ],
      targetAudience: 'Business Developers, Project Managers, Investors',
      technology: ['Market Analytics', 'Financial Modeling', 'Project Management', 'Risk Assessment'],
      pricing: 'Business plans starting ₹40,000/month'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'Rural Management', name: 'Rural Management' },
    { id: 'Production', name: 'Production' },
    { id: 'Quality Control', name: 'Quality Control' },
    { id: 'Sales', name: 'Sales & Distribution' },
    { id: 'Logistics', name: 'Logistics' },
    { id: 'Analytics', name: 'Analytics' },
    { id: 'Development', name: 'Development' }
  ];

  const filteredServices = activeTab === 'all'
    ? services
    : services.filter(service => service.category === activeTab);

  const platformFeatures = [
    {
      icon: <Cloud className="h-8 w-8" />,
      title: 'Cloud-First Architecture',
      desc: 'Scalable, secure, and reliable cloud infrastructure'
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: 'Mobile-First Design',
      desc: 'Optimized mobile applications for rural connectivity'
    },
    {
      icon: <Wifi className="h-8 w-8" />,
      title: 'IoT Integration',
      desc: 'Real-time sensor data and monitoring capabilities'
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: 'Real-Time Analytics',
      desc: 'Live dashboards and performance monitoring'
    }
  ];

  const supportOptions = [
    {
      title: '24/7 Support',
      desc: 'Round-the-clock technical and business support',
      contact: 'support@saubhagya.com'
    },
    {
      title: 'Training & Onboarding',
      desc: 'Comprehensive training programs for all stakeholders',
      contact: 'training@saubhagya.com'
    },
    {
      title: 'Consulting Services',
      desc: 'Strategic consulting for biogas ecosystem optimization',
      contact: 'consulting@saubhagya.com'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SAUBHAGYA</h1>
                <p className="text-xs text-gray-600">by Dhanush Group</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">About Us</Link>
              <Link to="/services" className="text-blue-600 font-semibold">Services</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Complete Platform Solutions
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Comprehensive
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600"> Biogas Solutions</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Seven integrated modules covering every aspect of the biogas value chain - from cattle management to carbon credit optimization. Built for stakeholders across the entire ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {platformFeatures.map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-blue-600 transition-colors">{feature.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 leading-relaxed">{feature.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories Filter */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center pb-20">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-white border-blue-100">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  variant={activeTab === category.id ? "default" : "outline"}
                  className={`transition-all duration-300 ${
                    activeTab === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg'
                      : 'hover:bg-blue-50 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  {activeTab === category.id && <Star className="w-4 h-4 mr-2" />}
                  {category.name}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Services Grid */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center pb-32">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredServices.map((service, index) => (
              <Card key={service.id} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden transform hover:scale-[1.02]">
                {/* Service Header */}
                <CardHeader className="bg-gradient-to-r from-blue-50 via-white to-green-50 pb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-4xl group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300 transform group-hover:scale-110">
                        {service.emoji}
                      </div>
                      <div>
                        <Badge className="mb-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-0">
                          <Layers className="w-3 h-3 mr-1" />
                          {service.category}
                        </Badge>
                        <CardTitle className="text-2xl mb-1 group-hover:text-blue-600 transition-colors">{service.title}</CardTitle>
                        <CardDescription className="text-blue-600 font-medium text-base">{service.subtitle}</CardDescription>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{service.description}</p>
                </CardHeader>

                {/* Service Details */}
                <CardContent className="space-y-6">
                  {/* Key Features */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                      Key Features
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <ThumbsUp className="w-5 h-5 mr-2 text-green-600" />
                      Business Benefits
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.benefits.map((benefit, idx) => (
                        <Badge key={idx} variant="secondary" className="text-sm bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 p-3 justify-start hover:from-blue-100 hover:to-blue-200 transition-all">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Technology Stack */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-purple-600" />
                      Technology Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {service.technology.map((tech, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs hover:bg-gray-100 transition-colors">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Pricing & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Target Users:</p>
                      <p className="text-sm font-medium text-gray-700 mb-2">{service.targetAudience}</p>
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        {service.pricing}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => navigate('/contact')}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Benefits */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center py-32 bg-white">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Integrated Platform Advantages</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              All modules work together seamlessly to provide a complete biogas ecosystem management solution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300 transform group-hover:scale-110">
                  <Users className="h-10 w-10 text-blue-600 group-hover:text-white" />
                </div>
                <CardTitle className="text-xl mb-4 group-hover:text-blue-600 transition-colors">Unified Data Flow</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">All modules share data seamlessly, eliminating silos and improving decision-making across the entire value chain.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300 transform group-hover:scale-110">
                  <TrendingUp className="h-10 w-10 text-green-600 group-hover:text-white" />
                </div>
                <CardTitle className="text-xl mb-4 group-hover:text-green-600 transition-colors">Cost Optimization</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">Integrated platform reduces operational costs by 40% compared to standalone solutions through shared infrastructure.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-300 transform group-hover:scale-110">
                  <Globe className="h-10 w-10 text-purple-600 group-hover:text-white" />
                </div>
                <CardTitle className="text-xl mb-4 group-hover:text-purple-600 transition-colors">Scalable Growth</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">Start with any module and expand seamlessly as your operations grow, with all components designed to scale together.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Support & Services */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center py-32 bg-gray-50">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Support & Professional Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive support ecosystem to ensure your success with SAUBHAGYA platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportOptions.map((option, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                      <Mail className="h-6 w-6 text-blue-600 group-hover:text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{option.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 mb-6 leading-relaxed">{option.desc}</CardDescription>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 transition-colors"
                  >
                    <a href={`mailto:${option.contact}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      {option.contact}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center py-32 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="w-full px-8 sm:px-12 lg:px-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Operations?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Start with any module or implement the complete platform. Our team will help you design the perfect solution for your biogas ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center text-lg font-semibold"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center text-lg font-semibold"
            >
              <PhoneCall className="mr-2 h-5 w-5" />
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">D</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">SAUBHAGYA</h3>
                  <p className="text-sm text-gray-400">by Dhanush Group</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                India's leading biogas ecosystem management platform, empowering rural communities through technology-driven sustainable energy solutions.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  info@saubhagya.com
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#gaushala" className="hover:text-white">GauShala Management</a></li>
                <li><a href="#biogassangh" className="hover:text-white">BiogasSangh Operations</a></li>
                <li><a href="#shuddhidoot" className="hover:text-white">ShuddhiDoot Purification</a></li>
                <li><a href="#transport" className="hover:text-white">Transport Management</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SAUBHAGYA by Dhanush Group. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}