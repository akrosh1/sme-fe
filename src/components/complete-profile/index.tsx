'use client';

import { useAppSelector } from '@/hooks/useDispatch';
import { store } from '@/store';
import { Provider } from 'react-redux';
import { FormProgress } from './components/formProgress';
import { BusinessInformation } from './components/steps/businessInformation';
import { OwnershipInformation } from './components/steps/ownershipInformation';
import { ProfileCompletion } from './components/steps/profileCompletion';
import { RegistrationDetails } from './components/steps/registrationDetails';
import { StaffServices } from './components/steps/staffServices';

const steps = [
  'Business Information',
  'Official Registration Details',
  'Ownership & Management',
  'Certificates & Documents',
];

const sectionTitles = [
  'Business Overview',
  'Registration & Industry Details',
  'Ownership & Team Information',
  'Staff & Services',
  'Complete Your Profile',
];

function FormContent() {
  const currentStep = useAppSelector((state) => state.form.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessInformation />;
      case 2:
        return <RegistrationDetails />;
      case 3:
        return <OwnershipInformation />;
      case 4:
        return <StaffServices />;
      case 5:
        return <ProfileCompletion />;
      default:
        return <BusinessInformation />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <FormProgress currentStep={currentStep} totalSteps={4} steps={steps} />

      {/* Section Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          {sectionTitles[currentStep - 1]}
        </h2>
      </div>

      {renderStep()}
    </div>
  );
}

export function MultiStepForm() {
  return (
    <Provider store={store}>
      <FormContent />
    </Provider>
  );
}
