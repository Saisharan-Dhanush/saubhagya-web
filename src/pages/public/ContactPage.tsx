/**
 * SAUBHAGYA - Contact Us Page
 * Multiple touchpoints for different stakeholders
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Users,
  Building,
  Truck,
  Factory,
  Shield,
  BarChart3,
  Target,
  MessageSquare,
  Calendar,
  ArrowRight,
  CheckCircle,
  Globe,
  Headphones,
  FileText
} from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    stakeholderType: '',
    module: '',
    message: '',
    preferredContact: 'email'
  });

  const stakeholderTypes = [
    { id: 'farmer', name: 'Farmer/Cattle Owner', icon: <Building className="h-5 w-5" />, color: 'bg-green-100 text-green-700' },
    { id: 'operator', name: 'Plant Operator', icon: <Factory className="h-5 w-5" />, color: 'bg-blue-100 text-blue-700' },
    { id: 'transporter', name: 'Transporter/Logistics', icon: <Truck className="h-5 w-5" />, color: 'bg-orange-100 text-orange-700' },
    { id: 'executive', name: 'Executive/Manager', icon: <Building className="h-5 w-5" />, color: 'bg-purple-100 text-purple-700' },
    { id: 'quality', name: 'Quality Analyst', icon: <Shield className="h-5 w-5" />, color: 'bg-red-100 text-red-700' },
    { id: 'sales', name: 'Sales/Distribution', icon: <BarChart3 className="h-5 w-5" />, color: 'bg-indigo-100 text-indigo-700' },
    { id: 'developer', name: 'Business Developer', icon: <Target className="h-5 w-5" />, color: 'bg-teal-100 text-teal-700' }
  ];

  const contactChannels = [
    {
      type: 'general',
      title: 'General Inquiries',
      icon: <MessageSquare className="h-6 w-6" />,
      contacts: [
        { label: 'Main Office', value: '+91 98765 43210', type: 'phone' },
        { label: 'Info Email', value: 'info@saubhagya.com', type: 'email' },
        { label: 'Business Hours', value: 'Mon-Sat, 9:00 AM - 6:00 PM IST', type: 'time' }
      ]
    },
    {
      type: 'sales',
      title: 'Sales & Partnerships',
      icon: <Building className="h-6 w-6" />,
      contacts: [
        { label: 'Sales Director', value: '+91 98765 43211', type: 'phone' },
        { label: 'Partnership Email', value: 'partnerships@saubhagya.com', type: 'email' },
        { label: 'Demo Requests', value: 'demo@saubhagya.com', type: 'email' }
      ]
    },
    {
      type: 'support',
      title: 'Technical Support',
      icon: <Headphones className="h-6 w-6" />,
      contacts: [
        { label: '24/7 Support', value: '+91 98765 43212', type: 'phone' },
        { label: 'Support Email', value: 'support@saubhagya.com', type: 'email' },
        { label: 'Emergency Line', value: '+91 98765 43213', type: 'phone' }
      ]
    }
  ];

  const regionalOffices = [
    {
      region: 'North India (HQ)',
      address: 'Sector 62, Noida, Uttar Pradesh 201309',
      phone: '+91 98765 43210',
      email: 'north@saubhagya.com',
      coverage: 'UP, Punjab, Haryana, Rajasthan, MP'
    },
    {
      region: 'West India',
      address: 'Pune, Maharashtra 411001',
      phone: '+91 98765 43220',
      email: 'west@saubhagya.com',
      coverage: 'Maharashtra, Gujarat, Goa'
    },
    {
      region: 'South India',
      address: 'Bangalore, Karnataka 560001',
      phone: '+91 98765 43230',
      email: 'south@saubhagya.com',
      coverage: 'Karnataka, Tamil Nadu, Andhra Pradesh, Kerala'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real implementation, this would submit to backend
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We will get back to you within 24 hours.');

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      organization: '',
      stakeholderType: '',
      module: '',
      message: '',
      preferredContact: 'email'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <Link to="/services" className="text-gray-700 hover:text-blue-600 font-medium">Services</Link>
              <Link to="/contact" className="text-blue-600 font-semibold">Contact</Link>
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
      <section className="pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <MessageSquare className="h-4 w-4 mr-2" />
              Get In Touch
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Contact
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600"> Our Team</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Connect with SAUBHAGYA experts across India. Multiple channels for every stakeholder in the biogas ecosystem.
            </p>
          </div>

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {contactChannels.map((channel, index) => (
              <div key={channel.type} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-lg mr-3">
                    {channel.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{channel.title}</h3>
                </div>
                <div className="space-y-3">
                  {channel.contacts.map((contact, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      {contact.type === 'phone' && <Phone className="h-4 w-4 text-gray-400 mr-3" />}
                      {contact.type === 'email' && <Mail className="h-4 w-4 text-gray-400 mr-3" />}
                      {contact.type === 'time' && <Clock className="h-4 w-4 text-gray-400 mr-3" />}
                      <div>
                        <p className="text-gray-600">{contact.label}</p>
                        <p className="text-gray-900 font-medium">{contact.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <p className="text-gray-600 mb-8">Tell us about your requirements and we'll connect you with the right expert.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Company/Organization name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">I am a *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {stakeholderTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleInputChange('stakeholderType', type.id)}
                        className={`p-3 rounded-lg border transition-colors text-left ${
                          formData.stakeholderType === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <div className={`p-1 rounded ${type.color} mr-2`}>
                            {type.icon}
                          </div>
                        </div>
                        <p className="text-xs font-medium text-gray-900">{type.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interested Module/Service</label>
                  <select
                    value={formData.module}
                    onChange={(e) => handleInputChange('module', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a module</option>
                    <option value="gaushala">GauShala Management</option>
                    <option value="biogassangh">BiogasSangh Operations</option>
                    <option value="shuddhidoot">ShuddhiDoot Purification</option>
                    <option value="urjavyapar">UrjaVyapar Sales</option>
                    <option value="transport">Transport Management</option>
                    <option value="urjaneta">UrjaNeta Analytics</option>
                    <option value="urjasanyojak">UrjaSanyojak Development</option>
                    <option value="complete">Complete Platform</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your requirements, challenges, or questions..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Contact Method</label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="email"
                        checked={formData.preferredContact === 'email'}
                        onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                        className="mr-2 text-blue-600"
                      />
                      Email
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="phone"
                        checked={formData.preferredContact === 'phone'}
                        onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                        className="mr-2 text-blue-600"
                      />
                      Phone
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="whatsapp"
                        checked={formData.preferredContact === 'whatsapp'}
                        onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                        className="mr-2 text-blue-600"
                      />
                      WhatsApp
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                >
                  Send Message
                  <Send className="ml-2 h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Regional Offices</h2>
              <p className="text-gray-600 mb-8">Our team is spread across India to provide localized support.</p>

              <div className="space-y-6">
                {regionalOffices.map((office, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{office.region}</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-900 font-medium">{office.address}</p>
                          <p className="text-gray-600">Covers: {office.coverage}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-3" />
                        <p className="text-gray-900 font-medium">{office.phone}</p>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-3" />
                        <p className="text-gray-900 font-medium">{office.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Immediate Help?</h3>
                <p className="text-gray-600 mb-4">Our support team is available 24/7 for critical issues.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="tel:+919876543212"
                    className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </a>
                  <a
                    href="https://wa.me/919876543212"
                    className="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quick answers to common questions about SAUBHAGYA platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How quickly can we get started?</h3>
              <p className="text-gray-600">Most modules can be deployed within 2-4 weeks. Complete platform implementation takes 6-12 weeks depending on scale and customization requirements.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you provide training?</h3>
              <p className="text-gray-600">Yes, we provide comprehensive training programs for all user types including on-site training, online sessions, and ongoing support materials.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can we start with one module?</h3>
              <p className="text-gray-600">Absolutely! You can start with any single module and expand gradually. Our platform is designed for seamless integration as you grow.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What about data security?</h3>
              <p className="text-gray-600">We follow industry-standard security practices with encrypted data transmission, secure cloud infrastructure, and regular security audits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already transforming their operations with SAUBHAGYA platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center text-lg font-semibold"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <a
              href="tel:+919876543210"
              className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center text-lg font-semibold"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/services" className="hover:text-white">Services</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="tel:+919876543212" className="hover:text-white">24/7 Support</a></li>
                <li><a href="mailto:support@saubhagya.com" className="hover:text-white">Email Support</a></li>
                <li><a href="https://wa.me/919876543212" className="hover:text-white">WhatsApp</a></li>
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