interface HomeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const HomeCard = ({ title, description, icon }: HomeCardProps) => {
  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="text-blue-600 text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
};
