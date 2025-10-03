import React from 'react';
import { Users, Award, Globe, Heart, Shield, Clock } from 'lucide-react';

export function About() {
  const stats = [
    { icon: Globe, label: 'Countries', value: '50+' },
    { icon: Users, label: 'Happy Travelers', value: '10,000+' },
    { icon: Award, label: 'Awards Won', value: '25+' },
    { icon: Heart, label: 'Years Experience', value: '15+' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Your safety is our top priority. We work with trusted partners and maintain the highest safety standards.'
    },
    {
      icon: Heart,
      title: 'Personalized Service',
      description: 'Every journey is unique. We tailor each experience to match your preferences and dreams.'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our dedicated team is available around the clock to assist you throughout your journey.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            About Wanderlust
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're passionate about creating unforgettable travel experiences that connect you with the world's most beautiful destinations and cultures.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h3>
            <p className="text-gray-600 mb-4">
              Founded in 2009, Wanderlust began as a small travel agency with a big dream: to make extraordinary travel accessible to everyone. What started as a passion project has grown into a trusted global platform that has helped thousands of travelers discover the world.
            </p>
            <p className="text-gray-600 mb-6">
              We believe that travel has the power to transform lives, broaden perspectives, and create lasting memories. That's why we're committed to curating exceptional experiences that go beyond typical tourist attractions.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Our Mission</div>
                <div className="text-gray-600">To inspire and enable meaningful travel experiences</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Travel experience"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="text-2xl font-bold text-gray-900">15+</div>
              <div className="text-gray-600">Years of Excellence</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}