
interface StepHeaderProps {
  title: string;
  description: string;
  isTransitioning: boolean;
}

export const StepHeader = ({ title, description, isTransitioning }: StepHeaderProps) => (
  <div className={`space-y-2 text-center sm:text-left transition-all duration-300 ${
    isTransitioning ? 'opacity-0 transform -translate-y-4' : 'opacity-100 transform translate-y-0'
  }`}>
    <h2 className="text-xl sm:text-2xl font-medium tracking-tight">
      {title}
    </h2>
    <p className="text-sm sm:text-base text-gray-600">
      {description}
    </p>
  </div>
);
