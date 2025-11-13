import AppRoutes from '@/AppRoutes';
import {Navbar, Footer} from '@/components';

export default function App() {
  return <div className="min-h-screen bg-gray-100">
    <Navbar />
    <div className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <AppRoutes />
    </div>
    <Footer />
  </div>;
}