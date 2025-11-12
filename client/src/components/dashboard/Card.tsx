import type { ReactNode } from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  bgColor?: string;
  iconBgColor?: string;
}

export const Card = ({
  title,
  value,
  icon,
  bgColor = 'bg-green-50',
  iconBgColor = 'bg-green-500',
}: CardProps) => {
  return (
    <div className={`${bgColor} p-6 rounded-lg shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-default`}>
      {/* Icon Circle */}
      <div className={`${iconBgColor} w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0`}>
        <div className="text-white text-2xl">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
          {title}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-gray-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

