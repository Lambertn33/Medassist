import AppRoutes from '@/AppRoutes';
import {Navbar} from '@/components';

export default function App() {
  return <div className="min-h-screen bg-gray-100">
    <Navbar />
      <div className="min-h-screen pt-20  px-4 sm:px-6 lg:px-8">
        <AppRoutes />
      </div>
  </div>;
}