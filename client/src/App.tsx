import AppRoutes from '@/AppRoutes';
import Navbar from '@/components/navbar/Navbar';

export default function App() {
  return <div className="min-h-screen bg-gray-100">
    <Navbar />
      <div className="pt-2">
        <AppRoutes />
      </div>
  </div>;
}