import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface BusinessInfo {
  businessName: string;
  businessType: string;
  registrationNumber: string;
  taxId: string;
  establishedYear: string;
  website: string;
  description: string;
}

export interface RegistrationDetails {
  legalStructure: string;
  industry: string;
  subIndustry: string;
  businessSize: string;
  annualRevenue: string;
  primaryLocation: string;
  operatingLicense: string;
  certifications: string[];
}

export interface OwnershipInfo {
  ownershipType: string;
  numberOfOwners: string;
  keyPersonnel: Array<{
    name: string;
    position: string;
    experience: string;
  }>;
  boardMembers: string;
  advisors: string;
}

export interface StaffServices {
  totalEmployees: string;
  fullTimeEmployees: string;
  partTimeEmployees: string;
  contractors: string;
  primaryServices: string[];
  targetMarket: string;
  serviceAreas: string[];
}

export interface ProfileCompletion {
  businessLogo: string;
  socialMediaLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
  };
  marketingPreferences: string[];
  communicationPreferences: string[];
}

export interface FormState {
  currentStep: number;
  businessInfo: BusinessInfo;
  registrationDetails: RegistrationDetails;
  ownershipInfo: OwnershipInfo;
  staffServices: StaffServices;
  profileCompletion: ProfileCompletion;
  isCompleted: boolean;
}

const initialState: FormState = {
  currentStep: 1,
  businessInfo: {
    businessName: '',
    businessType: '',
    registrationNumber: '',
    taxId: '',
    establishedYear: '',
    website: '',
    description: '',
  },
  registrationDetails: {
    legalStructure: '',
    industry: '',
    subIndustry: '',
    businessSize: '',
    annualRevenue: '',
    primaryLocation: '',
    operatingLicense: '',
    certifications: [],
  },
  ownershipInfo: {
    ownershipType: '',
    numberOfOwners: '',
    keyPersonnel: [],
    boardMembers: '',
    advisors: '',
  },
  staffServices: {
    totalEmployees: '',
    fullTimeEmployees: '',
    partTimeEmployees: '',
    contractors: '',
    primaryServices: [],
    targetMarket: '',
    serviceAreas: [],
  },
  profileCompletion: {
    businessLogo: '',
    socialMediaLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
    },
    marketingPreferences: [],
    communicationPreferences: [],
  },
  isCompleted: false,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    updateBusinessInfo: (
      state,
      action: PayloadAction<Partial<BusinessInfo>>,
    ) => {
      state.businessInfo = { ...state.businessInfo, ...action.payload };
    },
    updateRegistrationDetails: (
      state,
      action: PayloadAction<Partial<RegistrationDetails>>,
    ) => {
      state.registrationDetails = {
        ...state.registrationDetails,
        ...action.payload,
      };
    },
    updateOwnershipInfo: (
      state,
      action: PayloadAction<Partial<OwnershipInfo>>,
    ) => {
      state.ownershipInfo = { ...state.ownershipInfo, ...action.payload };
    },
    updateStaffServices: (
      state,
      action: PayloadAction<Partial<StaffServices>>,
    ) => {
      state.staffServices = { ...state.staffServices, ...action.payload };
    },
    updateProfileCompletion: (
      state,
      action: PayloadAction<Partial<ProfileCompletion>>,
    ) => {
      state.profileCompletion = {
        ...state.profileCompletion,
        ...action.payload,
      };
    },
    completeForm: (state) => {
      state.isCompleted = true;
    },
    resetForm: () => initialState,
  },
});

export const {
  setCurrentStep,
  updateBusinessInfo,
  updateRegistrationDetails,
  updateOwnershipInfo,
  updateStaffServices,
  updateProfileCompletion,
  completeForm,
  resetForm,
} = formSlice.actions;

export default formSlice.reducer;
