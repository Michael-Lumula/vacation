import React, { useState } from 'react';
import { Search, ExternalLink, Monitor, Database, Shield, Users, Settings, Globe, FileText, BarChart3, Calendar, Mail, Server, Network, Cpu } from 'lucide-react';

interface System {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: React.ComponentType<any>;
  status: 'active' | 'maintenance' | 'inactive';
  department: 'ICT' | 'PEC' | 'RRCS' | 'DSP';
  category: 'core' | 'support' | 'analytics' | 'communication';
}

const systems: System[] = [
  // ICT Department
  {
    id: '1',
    name: 'Network Management System',
    description: 'Monitor and manage network infrastructure across all locations',
    url: 'https://network.internal.com',
    icon: Monitor,
    status: 'active',
    department: 'ICT',
    category: 'core'
  },
  {
    id: '2',
    name: 'Database Administration Portal',
    description: 'Centralized database management and monitoring dashboard',
    url: 'https://db-admin.internal.com',
    icon: Database,
    status: 'active',
    department: 'ICT',
    category: 'core'
  },
  {
    id: '3',
    name: 'Security Operations Center',
    description: 'Real-time security monitoring and incident response system',
    url: 'https://soc.internal.com',
    icon: Shield,
    status: 'active',
    department: 'ICT',
    category: 'core'
  },
  {
    id: '4',
    name: 'IT Service Desk',
    description: 'Internal ticketing system for IT support requests',
    url: 'https://helpdesk.internal.com',
    icon: Settings,
    status: 'active',
    department: 'ICT',
    category: 'support'
  },

  // PEC Department
  {
    id: '5',
    name: 'Project Management Hub',
    description: 'Comprehensive project tracking and resource allocation system',
    url: 'https://projects.internal.com',
    icon: BarChart3,
    status: 'active',
    department: 'PEC',
    category: 'core'
  },
  {
    id: '6',
    name: 'Engineering Documentation',
    description: 'Technical specifications and engineering document repository',
    url: 'https://docs.internal.com',
    icon: FileText,
    status: 'active',
    department: 'PEC',
    category: 'support'
  },
  {
    id: '7',
    name: 'Quality Assurance Portal',
    description: 'Quality control processes and compliance tracking system',
    url: 'https://qa.internal.com',
    icon: Shield,
    status: 'maintenance',
    department: 'PEC',
    category: 'core'
  },
  {
    id: '8',
    name: 'Resource Planning System',
    description: 'Equipment and personnel resource management platform',
    url: 'https://resources.internal.com',
    icon: Calendar,
    status: 'active',
    department: 'PEC',
    category: 'support'
  },

  // RRCS Department
  {
    id: '9',
    name: 'Research Data Platform',
    description: 'Centralized research data collection and analysis system',
    url: 'https://research.internal.com',
    icon: Database,
    status: 'active',
    department: 'RRCS',
    category: 'core'
  },
  {
    id: '10',
    name: 'Collaboration Portal',
    description: 'Inter-departmental collaboration and communication hub',
    url: 'https://collaborate.internal.com',
    icon: Users,
    status: 'active',
    department: 'RRCS',
    category: 'communication'
  },
  {
    id: '11',
    name: 'Analytics Dashboard',
    description: 'Business intelligence and data visualization platform',
    url: 'https://analytics.internal.com',
    icon: BarChart3,
    status: 'active',
    department: 'RRCS',
    category: 'analytics'
  },
  {
    id: '12',
    name: 'Knowledge Base',
    description: 'Organizational knowledge management and sharing system',
    url: 'https://knowledge.internal.com',
    icon: FileText,
    status: 'active',
    department: 'RRCS',
    category: 'support'
  },

  // DSP Department
  {
    id: '13',
    name: 'Digital Services Gateway',
    description: 'Unified access point for all digital service offerings',
    url: 'https://services.internal.com',
    icon: Globe,
    status: 'active',
    department: 'DSP',
    category: 'core'
  },
  {
    id: '14',
    name: 'Customer Portal',
    description: 'External customer service and support interface',
    url: 'https://customer.internal.com',
    icon: Users,
    status: 'active',
    department: 'DSP',
    category: 'communication'
  },
  {
    id: '15',
    name: 'Performance Monitoring',
    description: 'Service performance metrics and uptime monitoring',
    url: 'https://monitoring.internal.com',
    icon: Monitor,
    status: 'active',
    department: 'DSP',
    category: 'analytics'
  },
  {
    id: '16',
    name: 'Communication Suite',
    description: 'Internal messaging and notification management system',
    url: 'https://comms.internal.com',
    icon: Mail,
    status: 'maintenance',
    department: 'DSP',
    category: 'communication'
  }
];

const departments = [
  { id: 'all', name: 'All Departments', color: '#6b7280' },
  { id: 'ICT', name: 'Information & Communication Technology', color: '#febf2d' },
  { id: 'PEC', name: 'Planning & Engineering Coordination', color: '#7ac149' },
  { id: 'RRCS', name: 'Research & Resource Coordination Services', color: '#febf2d' },
  { id: 'DSP', name: 'Digital Services Platform', color: '#7ac149' }
];

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'core', name: 'Core Systems' },
  { id: 'support', name: 'Support Tools' },
  { id: 'analytics', name: 'Analytics' },
  { id: 'communication', name: 'Communication' }
];

export function SystemsLayout() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSystems = systems.filter(system => {
    const matchesDepartment = selectedDepartment === 'all' || system.department === selectedDepartment;
    const matchesCategory = selectedCategory === 'all' || system.category === selectedCategory;
    const matchesSearch = system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         system.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDepartment && matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'inactive':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDepartmentColor = (department: string) => {
    const dept = departments.find(d => d.id === department);
    return dept?.color || '#6b7280';
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-primary opacity-10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-yellow-400 opacity-10 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-primary opacity-15 rounded-full blur-xl animate-float-reverse"></div>
        <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-yellow-300 opacity-10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-primary opacity-5 rounded-full blur-3xl animate-float-slow"></div>

        <Server className="absolute top-1/4 left-1/4 w-16 h-16 text-primary opacity-5 animate-float-slow" />
        <Network className="absolute top-1/3 right-1/4 w-20 h-20 text-yellow-400 opacity-8 animate-float-reverse" />
        <Database className="absolute bottom-1/3 left-1/3 w-14 h-14 text-primary opacity-5 animate-float" />
        <Cpu className="absolute bottom-1/4 right-1/3 w-18 h-18 text-yellow-300 opacity-8 animate-float-slow" />
      </div>

      {/* Header */}
      <div className="relative bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Internal Systems Directory
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Centralized access to all departmental systems and tools across the organization
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-6">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search systems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>

          {/* Department Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Departments</h3>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                    selectedDepartment === dept.id
                      ? 'text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedDepartment === dept.id ? dept.color : undefined
                  }}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSystems.map((system) => {
            const IconComponent = system.icon;
            return (
              <div
                key={system.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: getDepartmentColor(system.department) + '20' }}
                    >
                      <IconComponent 
                        className="h-6 w-6" 
                        style={{ color: getDepartmentColor(system.department) }}
                      />
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(system.status)}`}>
                      {system.status}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {system.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {system.description}
                  </p>

                  {/* Department Badge */}
                  <div className="mb-4">
                    <span 
                      className="inline-flex px-3 py-1 text-xs font-medium rounded-full text-white"
                      style={{ backgroundColor: getDepartmentColor(system.department) }}
                    >
                      {system.department}
                    </span>
                  </div>

                  {/* Action Button */}
                  <a
                    href={system.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 font-medium flex items-center justify-center gap-2 group"
                  >
                    Access System
                    <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredSystems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No systems found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-gray-900 mb-2">{systems.length}</div>
            <div className="text-sm text-gray-600">Total Systems</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {systems.filter(s => s.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {systems.filter(s => s.status === 'maintenance').length}
            </div>
            <div className="text-sm text-gray-600">Maintenance</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-gray-900 mb-2">4</div>
            <div className="text-sm text-gray-600">Departments</div>
          </div>
        </div>
      </div>
    </div>
  );
}