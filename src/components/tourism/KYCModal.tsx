import React, { useState } from 'react';
import { X, Upload, FileText, Camera, User, MapPin, Calendar, Phone, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface ValidationErrors {
  [key: string]: string;
}

interface KYCModalProps {
  onClose: () => void;
}

export function KYCModal({ onClose }: KYCModalProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'personal' | 'documents' | 'review' | 'success'>('personal');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Document Information
    documentType: 'passport',
    documentNumber: '',
    expiryDate: '',
    issuingCountry: '',
    
    // Files
    frontDocument: null as File | null,
    backDocument: null as File | null,
    selfiePhoto: null as File | null
  });

  const validatePersonalInfo = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
      } else if (age > 120) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    // Nationality validation
    if (!formData.nationality) {
      newErrors.nationality = 'Nationality is required';
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.city)) {
      newErrors.city = 'City can only contain letters, spaces, hyphens, and apostrophes';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State/Province is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP/Postal code is required';
    } else if (!/^[a-zA-Z0-9\s-]{3,10}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP/Postal code';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDocuments = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Document number validation
    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = 'Document number is required';
    } else if (formData.documentNumber.length < 5) {
      newErrors.documentNumber = 'Document number must be at least 5 characters';
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.documentNumber)) {
      newErrors.documentNumber = 'Document number can only contain letters and numbers';
    }

    // Expiry date validation
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      
      if (expiryDate <= today) {
        newErrors.expiryDate = 'Document must not be expired';
      }
      
      // Check if expiry is too far in the future (more than 20 years)
      const maxExpiryDate = new Date();
      maxExpiryDate.setFullYear(maxExpiryDate.getFullYear() + 20);
      
      if (expiryDate > maxExpiryDate) {
        newErrors.expiryDate = 'Expiry date seems invalid';
      }
    }

    // Issuing country validation
    if (!formData.issuingCountry) {
      newErrors.issuingCountry = 'Issuing country is required';
    }

    // File validation
    if (!formData.frontDocument) {
      newErrors.frontDocument = 'Document front side is required';
    } else {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(formData.frontDocument.type)) {
        newErrors.frontDocument = 'File must be JPG, PNG, or PDF';
      } else if (formData.frontDocument.size > 10 * 1024 * 1024) {
        newErrors.frontDocument = 'File size must be less than 10MB';
      }
    }

    // Back document validation (only for non-passport documents)
    if (formData.documentType !== 'passport' && !formData.backDocument) {
      newErrors.backDocument = 'Document back side is required for this document type';
    } else if (formData.backDocument) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(formData.backDocument.type)) {
        newErrors.backDocument = 'File must be JPG, PNG, or PDF';
      } else if (formData.backDocument.size > 10 * 1024 * 1024) {
        newErrors.backDocument = 'File size must be less than 10MB';
      }
    }

    // Selfie validation
    if (!formData.selfiePhoto) {
      newErrors.selfiePhoto = 'Selfie photo is required';
    } else {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(formData.selfiePhoto.type)) {
        newErrors.selfiePhoto = 'Selfie must be JPG or PNG';
      } else if (formData.selfiePhoto.size > 10 * 1024 * 1024) {
        newErrors.selfiePhoto = 'File size must be less than 10MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (field: 'frontDocument' | 'backDocument' | 'selfiePhoto') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
      
      // Clear error when file is selected
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const handlePersonalInfoNext = () => {
    if (validatePersonalInfo()) {
      setCurrentStep('documents');
    }
    // If validation fails, errors are already set and displayed
  };

  const handleDocumentsNext = () => {
    if (validateDocuments()) {
      setCurrentStep('review');
    }
    // If validation fails, errors are already set and displayed
  };

  const handleSubmit = async () => {
    // Final validation before submission
    if (!validatePersonalInfo() || !validateDocuments()) {
      return;
    }
    
    setLoading(true);
    
    // Simulate KYC submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCurrentStep('success');
    setLoading(false);
  };

  const documentTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'drivers_license', label: 'Driver\'s License' },
    { value: 'national_id', label: 'National ID Card' },
    { value: 'residence_permit', label: 'Residence Permit' }
  ];

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
    'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Japan',
    'South Korea', 'Singapore', 'New Zealand', 'Switzerland', 'Austria'
  ];

  if (currentStep === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">KYC Submitted Successfully!</h3>
          <p className="text-gray-600 mb-4">
            Your identity verification documents have been submitted for review.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            We'll review your documents within 24-48 hours and notify you via email once approved.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Identity Verification (KYC)</h2>
            <p className="text-gray-600">Complete your profile to unlock all booking features</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${currentStep === 'personal' ? 'text-blue-600' : currentStep === 'documents' || currentStep === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'personal' ? 'bg-blue-100' : currentStep === 'documents' || currentStep === 'review' ? 'bg-green-100' : 'bg-gray-100'}`}>
                <User className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Personal Info</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep === 'documents' ? 'text-blue-600' : currentStep === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'documents' ? 'bg-blue-100' : currentStep === 'review' ? 'bg-green-100' : 'bg-gray-100'}`}>
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Documents</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep === 'review' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'review' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <CheckCircle className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Review</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {currentStep === 'personal' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      required
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                  <select
                    name="nationality"
                    required
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.nationality ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select nationality</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  {errors.nationality && (
                    <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Street address"
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="City"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.state ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="State"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.zipCode ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="12345"
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.country ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                )}
              </div>

              <button
                onClick={handlePersonalInfoNext}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Documents
              </button>
            </div>
          )}

          {currentStep === 'documents' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Identity Documents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {documentTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Number</label>
                  <input
                    type="text"
                    name="documentNumber"
                    required
                    value={formData.documentNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.documentNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Document number"
                  />
                  {errors.documentNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.documentNumber}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    required
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.expiryDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Country</label>
                  <select
                    name="issuingCountry"
                    required
                    value={formData.issuingCountry}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.issuingCountry ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  {errors.issuingCountry && (
                    <p className="mt-1 text-sm text-red-600">{errors.issuingCountry}</p>
                  )}
                </div>
              </div>

              {/* File Uploads */}
              <div className="space-y-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Front Side
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors ${
                    errors.frontDocument ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload('frontDocument')}
                      className="hidden"
                      id="front-document"
                    />
                    <label htmlFor="front-document" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {formData.frontDocument ? formData.frontDocument.name : 'Click to upload front side'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG or PDF up to 10MB</p>
                    </label>
                  </div>
                  {errors.frontDocument && (
                    <p className="mt-1 text-sm text-red-600">{errors.frontDocument}</p>
                  )}
                </div>

                {formData.documentType !== 'passport' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Back Side
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors ${
                      errors.backDocument ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload('backDocument')}
                        className="hidden"
                        id="back-document"
                      />
                      <label htmlFor="back-document" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {formData.backDocument ? formData.backDocument.name : 'Click to upload back side'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG or PDF up to 10MB</p>
                      </label>
                    </div>
                    {errors.backDocument && (
                      <p className="mt-1 text-sm text-red-600">{errors.backDocument}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selfie Photo
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors ${
                    errors.selfiePhoto ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload('selfiePhoto')}
                      className="hidden"
                      id="selfie-photo"
                    />
                    <label htmlFor="selfie-photo" className="cursor-pointer">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {formData.selfiePhoto ? formData.selfiePhoto.name : 'Click to upload selfie'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Clear photo of yourself holding the document</p>
                    </label>
                  </div>
                  {errors.selfiePhoto && (
                    <p className="mt-1 text-sm text-red-600">{errors.selfiePhoto}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep('personal')}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleDocumentsNext}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review Submission
                </button>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Review Your Information</h3>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-medium text-gray-900 mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 text-gray-900">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date of Birth:</span>
                    <span className="ml-2 text-gray-900">{formData.dateOfBirth}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Nationality:</span>
                    <span className="ml-2 text-gray-900">{formData.nationality}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 text-gray-900">{formData.phoneNumber}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600">Address:</span>
                    <span className="ml-2 text-gray-900">
                      {formData.address}, {formData.city}, {formData.state} {formData.zipCode}, {formData.country}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-medium text-gray-900 mb-4">Document Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Document Type:</span>
                    <span className="ml-2 text-gray-900">
                      {documentTypes.find(t => t.value === formData.documentType)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Document Number:</span>
                    <span className="ml-2 text-gray-900">{formData.documentNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Expiry Date:</span>
                    <span className="ml-2 text-gray-900">{formData.expiryDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Issuing Country:</span>
                    <span className="ml-2 text-gray-900">{formData.issuingCountry}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-medium text-gray-900 mb-4">Uploaded Documents</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-gray-900">Document Front: {formData.frontDocument?.name}</span>
                  </div>
                  {formData.backDocument && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-gray-900">Document Back: {formData.backDocument.name}</span>
                    </div>
                  )}
                  {formData.selfiePhoto && (
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-green-600" />
                      <span className="text-gray-900">Selfie Photo: {formData.selfiePhoto.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-900 mb-2">Important Notice</h4>
                <p className="text-sm text-blue-800">
                  By submitting this information, you confirm that all details are accurate and the documents are genuine. 
                  False information may result in account suspension.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep('documents')}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit KYC'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}