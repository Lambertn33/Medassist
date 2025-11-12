import AppRoutes from './routings';
import Navbar from './components/navbar/Navbar';

export default function App() {
  return <div className="min-h-screen bg-gray-100">
    <Navbar />
      <div className="">
        <AppRoutes />
      </div>
  </div>;
}