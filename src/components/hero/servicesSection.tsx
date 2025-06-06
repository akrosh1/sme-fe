import { BookOpen, TrendingUp, Users } from 'lucide-react';
import { ReactNode } from 'react';
import FeatureCard from './featureCard';

const t = {
  services: {
    title: 'Our Services',
    subtitle:
      'Access business development resources, expert guidance, training programs, and grow your enterprise',
    consultation: 'News & Regulation Updates',
    consultationDesc:
      'Get real-time updates on legal changes, policies, and compliance notices.',
    training: 'Schemes & Subsidies',
    trainingDesc:
      'Access government, bank, and NGO/INGO financial assistance programs.',
    financial: 'Compliance Calendar & Reminders',
    financialDesc:
      'Never miss a deadline for VAT, PAN, renewal, and more with automated alerts.',
  },
};

const ServicesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.services.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { key: 'consultation', icon: Users, color: 'text-blue-600' },
            { key: 'training', icon: BookOpen, color: 'text-green-600' },
            { key: 'financial', icon: TrendingUp, color: 'text-purple-600' },
          ].map((service) => (
            // <Card
            //   key={service.key}
            //   className="hover:shadow-lg transition-shadow duration-300"
            // >
            //   <CardHeader>
            //     <div className={`${service.color} mb-4`}>
            //       <service.icon className="h-12 w-12" />
            //     </div>
            //     <CardTitle className="text-xl">
            //       {t.services[service.key as keyof typeof t.services]}
            //     </CardTitle>
            //   </CardHeader>
            //   <CardContent>
            //     <CardDescription className="text-base">
            //       {t.services.consultationDesc}
            //     </CardDescription>
            //   </CardContent>
            // </Card>
            <FeatureCard
              description={t.services[service.key as keyof typeof t.services]}
              key={service.key}
              icon={service?.icon.name as ReactNode | undefined}
              title={t.services[service.key as keyof typeof t.services]}
              accentColor={service.color}
              className="hover:shadow-lg transition-shadow duration-300"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
