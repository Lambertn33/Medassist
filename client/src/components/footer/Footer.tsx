export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-600">
              © {currentYear} MedAssist. All rights reserved.
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-sm text-gray-600">
              Streamlining patient consultations for rural clinics
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

