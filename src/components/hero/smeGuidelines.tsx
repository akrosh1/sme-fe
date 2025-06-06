import { BotIcon, DatabaseIcon, ShieldIcon, SparklesIcon } from 'lucide-react';
import FeatureCard from './featureCard';

const SmeGuidelines = () => {
  const guidelines = [
    {
      icon: <BotIcon />,
      title: 'Eligibility Criteria',
      description:
        'A registration process is applied to verify the SME status of all companies that meet the SME criteria.',
      accentColor: 'rgba(36, 101, 237, 0.5)',
    },
    {
      icon: <SparklesIcon />,
      title: 'Customizable Agents',
      description:
        'Use our built-in agents or create your own to automate complex workflows and tasks.',
      accentColor: 'rgba(236, 72, 153, 0.5)',
    },
    {
      icon: <DatabaseIcon />,
      title: 'Enterprise Knowledge Base',
      description:
        'Secure knowledge management with fine-grained access controls and reference tracking.',
      accentColor: 'rgba(34, 211, 238, 0.5)',
    },
    {
      icon: <ShieldIcon />,
      title: 'Enterprise Security',
      description:
        'Bank-level encryption, compliance controls, and data sovereignty options.',
      accentColor: 'rgba(132, 204, 22, 0.5)',
    },
  ];
  return (
    <section className="py-20 bg-white">
      <div className="flex items-center max-w-7xl mx-auto gap-5 md:gap-10 px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {'SME Guidelines'}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            {
              'Find practical guidelines, eligibility criteria, and step-by-step instructions to help SMEs and BDSPs navigate services, access resources, and make the most of this platform.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {guidelines.map((guideline, index) => (
            <FeatureCard
              className="bg-white shadow-xl border-0"
              key={index}
              icon={guideline.icon}
              title={guideline.title}
              description={guideline.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmeGuidelines;
