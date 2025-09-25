/**
 * AgriNest - Landing Page
 * Growing a Sustainable Future - Agricultural Solutions Platform
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Leaf,
  Users,
  Award,
  BarChart3,
  Shield,
  Play,
  CheckCircle,
  PhoneCall,
  Mail,
  Star,
  ThumbsUp,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-600">
      {/* Navigation Header */}
      <nav className="bg-green-600 relative z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Leaf className="text-white h-6 w-6" />
              <span className="text-white text-xl font-bold">AgriNest</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-white/90 hover:text-white font-medium">Home</Link>
              <Link to="/services" className="text-white/90 hover:text-white font-medium">Service</Link>
              <Link to="/about" className="text-white/90 hover:text-white font-medium">Solutions</Link>
              <Link to="/contact" className="text-white/90 hover:text-white font-medium">Resources</Link>
              <button className="bg-lime-400 hover:bg-lime-500 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-green-600 pb-0">
        <div className="max-w-6xl mx-auto px-6 pt-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Content */}
            <div className="col-span-6 text-white py-12">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Growing a<br />
                <span className="text-lime-300">Sustainable</span><br />
                Future
              </h1>
              <p className="text-lg text-green-100 mb-8 max-w-md">
                Empowering farmers with innovation, sustainability, smart solutions, and care for the land
              </p>
              <button className="bg-lime-400 hover:bg-lime-500 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors">
                Get Started
              </button>
            </div>

            {/* Right Content - Images and Service Panel */}
            <div className="col-span-6 relative">
              {/* Main Images Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white p-2 rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                    alt="Hands with seedlings"
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
                <div className="bg-white p-2 rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                    alt="Farmer in field"
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              </div>

              {/* Our Products & Service Panel */}
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <h3 className="font-bold text-gray-900 mb-2">Our Products & Service</h3>
                <p className="text-sm text-gray-600 mb-4">Explore our fertilizer software and solutions</p>

                {/* Certified Badge */}
                <div className="bg-green-50 rounded-lg p-3 mb-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">100% Certified and</div>
                    <div className="text-sm font-semibold text-gray-900">trusted by farmers</div>
                  </div>
                </div>

                {/* Technology in Farming */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Technology in Farming</h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Experience farming with innovative technology and data-driven solutions for sustainable agriculture
                  </p>

                  {/* Stats and Images Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-green-100 p-2 rounded text-center">
                      <div className="text-lg font-bold text-green-600">915,760</div>
                      <div className="text-xs text-green-600">+2%</div>
                    </div>
                    <div className="text-center">
                      <img
                        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                        alt="Real-Time Farm"
                        className="w-full h-12 object-cover rounded mb-1"
                      />
                      <div className="text-xs text-gray-600">Real-Time Farm Insights</div>
                    </div>
                    <div className="text-center">
                      <img
                        src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                        alt="Smart Irrigation"
                        className="w-full h-12 object-cover rounded mb-1"
                      />
                      <div className="text-xs text-gray-600">Smart Irrigation Systems</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">10+</div>
              <div className="text-gray-600">Years in Agriculture</div>
              <div className="text-sm text-gray-500 mt-1">Experience that farmers can trust</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-xl font-bold text-gray-900">Eco-Friendly Solutions</div>
              <div className="text-gray-600">100% Certified Quality</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-xl font-bold text-gray-900">120K+ People Joined</div>
              <div className="text-gray-600">Shaping the Future of Connected Agriculture</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Empowering Growth Through{" "}
              <span className="text-green-600">Vision & Values</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We are committed to transforming agriculture with smart solutions, trusted values, and a vision for a more sustainable future.
            </p>
            <button className="mt-8 bg-lime-400 hover:bg-lime-500 text-gray-900 px-8 py-3 rounded-lg font-semibold">
              Join Now
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Our Mission */}
            <Card className="p-8 border-0 bg-gray-50 relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-600 transform rotate-45"></div>
              </div>
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 leading-relaxed mb-6">
                  To empower farmers with innovative, sustainable, and affordable solutions that enhance crop yield, preserve the environment, and improve livelihoods.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Innovative agricultural technology</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Sustainable farming practices</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Environmental stewardship</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Our Vision */}
            <Card className="p-8 border-0 bg-gray-50 relative">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-600 transform rotate-45"></div>
              </div>
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 leading-relaxed mb-6">
                  To create a future where farming is smart, sustainable, and profitable, ensuring food security and prosperity for generations to come.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span className="text-sm text-gray-700">Global food security leadership</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span className="text-sm text-gray-700">Climate-resilient agriculture</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span className="text-sm text-gray-700">Prosperous farming communities</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Farmers Trust Us */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why <span className="text-green-600">Farmers Trust Us</span>
            </h2>
            <p className="text-lg text-gray-600">
              Trusted by Farmers for Quality, Support, and Sustainable Solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Affordable Solutions</h3>
              <p className="text-gray-600">
                High-quality agricultural solutions and innovative crop management at prices that work for every farmer.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">24/7 Expert Support</h3>
              <p className="text-gray-600">
                Our dedicated team of agricultural experts provides round-the-clock support across every stage of cultivation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sustainability-Focused Practices</h3>
              <p className="text-gray-600">
                All our solutions promote eco-friendly methods and sustainable farming practices for future generations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1530587191325-3db32d826c18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Sustainable Farming"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="font-semibold">Sustainable Farming</h4>
                <p className="text-sm opacity-90">Preserving land for future generations</p>
              </div>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Innovation Technology"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="font-semibold">Innovation Technology</h4>
                <p className="text-sm opacity-90">Smart solutions for modern farming</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-6 w-6 text-white" />
                <h3 className="text-lg font-bold">AgriNest</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Leading agricultural platform, empowering farmers through technology-driven sustainable farming solutions.
              </p>
              <div className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                info@agrinest.com
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/services" className="hover:text-white">Services</Link></li>
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AgriNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}