import { Award, Building2, TrendingUp, Users } from 'lucide-react';
import { Button } from '../ui/button';

const SmeDevelopmentStage = () => {
  return (
    <section className="py-20 pb-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-8 items-start relative">
          {/* Left Content */}
          <div className="col-span-12 lg:col-span-2 z-10 absolute max-w-[432px]">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              SME Development Steps
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              A step-by-step path designed to guide you through your business
              journey.
            </p>
            <Button size={'lg'} className="bg-primary text-white px-8 text-lg">
              Get Started
            </Button>
          </div>

          {/* Right - Development Path */}
          <div className="col-span-12 lg:col-span-12 relative">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 800 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M100 450 Q200 350 350 380 Q500 410 650 280 Q750 220 780 100"
                stroke="#FF6B6B"
                strokeWidth="4"
                fill="none"
              />
            </svg>

            {/* Business Stage Points */}
            <div className="relative h-[350px]">
              {/* Starting a Business */}
              <div className="absolute" style={{ left: '6%', top: '75%' }}>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Building2 className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-center max-w-xs">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      Starting a Business
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Register your business, get legal approvals, and access
                      initial support to begin your journey.
                    </p>
                  </div>
                </div>
              </div>

              {/* Managing a Business */}
              <div className="absolute" style={{ left: '35%', top: '70%' }}>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-center max-w-xs">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      Managing a Business
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Handle operations, maintain records, file taxes, and stay
                      compliant with government rules.
                    </p>
                  </div>
                </div>
              </div>

              {/* Growing a Business */}
              <div className="absolute" style={{ left: '60%', top: '57%' }}>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-center max-w-xs">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      Growing a Business
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Access finance, training, and support to expand your team,
                      market, and impact.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sustaining a Business */}
              <div className="absolute" style={{ left: '85%', top: '35%' }}>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-center max-w-xs">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      Sustaining a Business
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Improve efficiency, stay competitive, and build long-term
                      resilience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmeDevelopmentStage;
