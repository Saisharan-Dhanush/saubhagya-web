/**
 * SAUBHAGYA - About Us Page
 * Dhanush Group Story and Mission
 */

import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Leaf,
  Zap,
  Target,
  Users,
  Globe,
  Award,
  Heart,
  TrendingUp,
  Shield,
  Lightbulb,
  CheckCircle,
  Calendar,
  MapPin,
  PhoneCall,
  Mail,
  Star,
  Sparkles,
  Trophy,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AboutPage() {
  const navigate = useNavigate();

  const milestones = [
    {
      year: "2019",
      title: "Foundation",
      desc: "Dhanush Group established with vision to revolutionize rural energy sector"
    },
    {
      year: "2020",
      title: "First Biogas Plant",
      desc: "Launched pilot biogas production facility in Maharashtra"
    },
    {
      year: "2021",
      title: "Technology Integration",
      desc: "Developed IoT-based monitoring systems for biogas production"
    },
    {
      year: "2022",
      title: "Platform Launch",
      desc: "SAUBHAGYA platform launched connecting 1,000+ farmers"
    },
    {
      year: "2023",
      title: "National Expansion",
      desc: "Expanded operations across 5 states with 100+ biogas plants"
    },
    {
      year: "2024",
      title: "Carbon Credits",
      desc: "Launched carbon credit tracking generating ₹10 Cr+ ESG revenue"
    }
  ];

  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Rural Empowerment",
      desc: "Creating sustainable livelihoods for farming communities through technology"
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Environmental Sustainability",
      desc: "Converting agricultural waste into clean energy while reducing carbon footprint"
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Innovation Excellence",
      desc: "Leveraging AI, IoT, and data analytics to optimize biogas production"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Transparency & Trust",
      desc: "Building trust through transparent operations and fair pricing mechanisms"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community First",
      desc: "Putting rural communities at the center of our business model"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Result Oriented",
      desc: "Delivering measurable impact in rural income generation and environmental benefits"
    }
  ];

  const leadership = [
    {
      name: "Rajesh Kumar",
      position: "Founder & CEO",
      image: "👨‍💼",
      bio: "20+ years in rural development and renewable energy sector"
    },
    {
      name: "Priya Sharma",
      position: "CTO",
      image: "👩‍💻",
      bio: "Technology leader with expertise in IoT and AI applications"
    },
    {
      name: "Amit Patel",
      position: "Head of Operations",
      image: "👨‍🔧",
      bio: "Expert in biogas production and rural supply chain management"
    },
    {
      name: "Dr. Sunita Singh",
      position: "Head of Sustainability",
      image: "👩‍🔬",
      bio: "Environmental scientist specializing in carbon credit mechanisms"
    }
  ];

  const impact = [
    { metric: "10,000+", label: "Farmers Empowered", icon: "👨‍🌾" },
    { metric: "500+", label: "Biogas Plants", icon: "🏭" },
    { metric: "₹50 Cr+", label: "Rural Revenue Generated", icon: "💰" },
    { metric: "1M+ Tons", label: "CO2 Emissions Reduced", icon: "🌱" },
    { metric: "25,000+", label: "Cattle Under Management", icon: "🐄" },
    { metric: "5 States", label: "Geographic Presence", icon: "🗺️" }
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
              <Link to="/about" className="text-blue-600 font-semibold">About Us</Link>
              <Link to="/services" className="text-gray-700 hover:text-blue-600 font-medium">Services</Link>
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
            <div className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-700 rounded-full text-lg font-medium mb-8">
              <Zap className="h-5 w-5 mr-3" />
              About Dhanush Group
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Transforming Rural India Through
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600"> Clean Energy</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We are pioneering the digitization of India's biogas ecosystem, creating sustainable livelihoods for rural communities while addressing the climate crisis through innovative technology solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-3xl text-gray-900">Our Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    To empower rural India by creating a comprehensive digital ecosystem that transforms agricultural waste into valuable energy resources, while ensuring fair compensation for farmers and contributing to India's carbon neutrality goals.
                  </p>

                  <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-xl text-gray-900">Vision 2030</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-700 leading-relaxed">
                        To become India's largest rural energy platform, connecting 1 million farmers and managing 10,000 biogas plants while generating ₹1000 Cr+ in rural revenue and preventing 10 million tons of CO2 emissions annually.
                      </p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white border-0 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-white/5 opacity-20"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Why SAUBHAGYA?</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                {[
                  "Complete end-to-end biogas ecosystem management",
                  "Real-time IoT monitoring and AI-powered analytics",
                  "Transparent pricing and digital payment systems",
                  "Carbon credit generation and ESG compliance",
                  "Multi-stakeholder platform serving entire value chain"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-300" />
                    <span className="text-white">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center py-32 bg-white">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Impact</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Measurable results in rural empowerment and environmental sustainability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {impact.map((item, index) => (
              <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-3xl group-hover:from-blue-500 group-hover:to-blue-600 group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                    {item.icon}
                  </div>
                  <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors">{item.metric}</div>
                  <div className="text-gray-700 font-medium group-hover:text-gray-800 transition-colors">{item.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center py-32 bg-gray-50">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              The principles that guide our mission to transform rural India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {values.map((value, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl mb-3 group-hover:text-blue-600 transition-colors">{value.title}</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">{value.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center py-32 bg-white">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Journey</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              From a vision to transform rural energy to India's leading biogas platform
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.desc}</p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center py-32 bg-gray-50">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Leadership Team</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Visionary leaders driving innovation in rural energy transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {leadership.map((leader, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 text-center overflow-hidden">
                <CardContent className="p-8">
                  <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-blue-100 group-hover:border-blue-300 transition-colors">
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      {leader.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl mb-1 group-hover:text-blue-600 transition-colors">{leader.name}</CardTitle>
                  <Badge className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                    {leader.position}
                  </Badge>
                  <CardDescription className="text-gray-600 text-sm leading-relaxed">{leader.bio}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Innovation */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center py-32 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Technology Innovation</h2>
            <p className="text-lg text-blue-100 mb-12 max-w-3xl mx-auto">
              Leveraging cutting-edge technology to create sustainable solutions for rural India
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl group-hover:bg-white/30 transition-colors">
                    🤖
                  </div>
                  <CardTitle className="text-xl mb-3 text-white">AI & Machine Learning</CardTitle>
                  <CardDescription className="text-blue-100">Predictive analytics for production optimization and demand forecasting</CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl group-hover:bg-white/30 transition-colors">
                    📡
                  </div>
                  <CardTitle className="text-xl mb-3 text-white">IoT Integration</CardTitle>
                  <CardDescription className="text-blue-100">Real-time monitoring of biogas production and equipment performance</CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl group-hover:bg-white/30 transition-colors">
                    📱
                  </div>
                  <CardTitle className="text-xl mb-3 text-white">Mobile-First Design</CardTitle>
                  <CardDescription className="text-blue-100">User-friendly mobile applications for rural communities</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center py-32 bg-white">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Awards & Recognition</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Acknowledged for our contributions to rural development and clean energy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <Card className="text-center group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="p-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center group-hover:from-yellow-500 group-hover:to-yellow-600 transition-all duration-300 transform group-hover:scale-110">
                  <Trophy className="h-10 w-10 text-yellow-600 group-hover:text-white" />
                </div>
                <CardTitle className="text-xl mb-2 group-hover:text-yellow-700 transition-colors">Clean Energy Innovation Award</CardTitle>
                <CardDescription className="text-gray-600">Ministry of New and Renewable Energy, 2023</CardDescription>
                <Badge className="mt-3 bg-yellow-100 text-yellow-700">Government Recognition</Badge>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center group-hover:from-green-500 group-hover:to-green-600 transition-all duration-300 transform group-hover:scale-110">
                  <Users className="h-10 w-10 text-green-600 group-hover:text-white" />
                </div>
                <CardTitle className="text-xl mb-2 group-hover:text-green-700 transition-colors">Rural Development Excellence</CardTitle>
                <CardDescription className="text-gray-600">National Rural Development Agency, 2023</CardDescription>
                <Badge className="mt-3 bg-green-100 text-green-700">Social Impact</Badge>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300 transform group-hover:scale-110">
                  <Star className="h-10 w-10 text-blue-600 group-hover:text-white" />
                </div>
                <CardTitle className="text-xl mb-2 group-hover:text-blue-700 transition-colors">Startup of the Year</CardTitle>
                <CardDescription className="text-gray-600">AgTech India Summit, 2024</CardDescription>
                <Badge className="mt-3 bg-blue-100 text-blue-700">Industry Recognition</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center py-32 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="w-full px-8 sm:px-12 lg:px-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Mission</h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Be part of India's largest rural energy transformation. Together, we can create sustainable livelihoods and a cleaner future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center text-lg font-semibold"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center text-lg font-semibold"
            >
              <PhoneCall className="mr-2 h-5 w-5" />
              Contact Us
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
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/services" className="hover:text-white">Services</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
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