const HomePage = () => {
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to MedAssist
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
            Streamline patient consultations and encounter recording for rural clinics
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Patient Management
            </h3>
            <p className="text-gray-600">
              Efficiently record and manage patient information and demographics
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Encounter Tracking
            </h3>
            <p className="text-gray-600">
              Track consultation progress from initialization to completion
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Observations & Diagnoses
            </h3>
            <p className="text-gray-600">
              Record vital signs, observations, and diagnoses seamlessly
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-lg shadow-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Get Started</h2>
          <p className="text-lg mb-6 text-blue-100">
            Sign in to access the consultation assistant
          </p>
          <a
            href="/login"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Authenticate
          </a>
        </div>
      </div>
    </div>
  );
}

export default HomePage;