import { cn } from '@/lib/utils';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function FormProgress({
  currentStep,
  totalSteps,
  steps,
}: FormProgressProps) {
  return (
    <div className="w-full mb-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Complete Your Profile
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Complete the details below to create your account. You'll receive an
          OTP to verify your email before accessing the platform.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div key={stepNumber} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200',
                      isCurrent || isCompleted
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-white border-gray-300',
                    )}
                  >
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full transition-all duration-200',
                        isCurrent || isCompleted ? 'bg-white' : 'bg-gray-300',
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-sm mt-3 text-center max-w-24 leading-tight font-medium',
                      isCurrent || isCompleted
                        ? 'text-gray-900'
                        : 'text-gray-500',
                    )}
                  >
                    {step}
                  </span>
                </div>
                {stepNumber < totalSteps && (
                  <div
                    className={cn(
                      'h-0.5 w-20 mx-4 transition-all duration-200',
                      stepNumber < currentStep ? 'bg-blue-600' : 'bg-gray-300',
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Counter */}
      <div className="text-center">
        <p className="text-gray-500 text-sm mb-2">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  );
}
