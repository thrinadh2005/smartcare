import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BeakerIcon, 
  CalendarIcon, 
  ClockIcon,
  SpeakerWaveIcon,
  ArrowRightOnRectangleIcon,
  PrinterIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { medicineAPI, appointmentAPI, productAPI } from '../services/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const [medicinesRes, appointmentsRes, expiringRes] = await Promise.all([
        medicineAPI.getTodayMedicines(),
        appointmentAPI.getUpcomingAppointments(),
        productAPI.getExpiringSoon()
      ]);

      setMedicines(medicinesRes.data);
      setAppointments(appointmentsRes.data);
      setExpiringProducts(expiringRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSummary = () => {
    if ('speechSynthesis' in window && !speaking) {
      setSpeaking(true);
      
      let summary = `Hello ${user?.name || 'User'}. `;
      
      if (medicines.length > 0) {
        summary += `You have ${medicines.length} medicines today. `;
        medicines.forEach((medicine) => {
          medicine.dosageTimes.forEach(dosage => {
            summary += `${medicine.name} ${dosage.label} at ${dosage.time}. `;
          });
        });
      } else {
        summary += 'You have no medicines scheduled for today. ';
      }
      
      if (appointments.length > 0) {
        const nextAppointment = appointments[0];
        const daysUntil = Math.ceil((new Date(nextAppointment.date) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysUntil === 0) {
          summary += `You have a doctor appointment today with Dr. ${nextAppointment.doctorName} at ${nextAppointment.time}. `;
        } else {
          summary += `You have a doctor appointment in ${daysUntil} day${daysUntil > 1 ? 's' : ''} with Dr. ${nextAppointment.doctorName}. `;
        }
      } else {
        summary += 'You have no upcoming appointments. ';
      }
      
      if (expiringProducts.length > 0) {
        summary += `You have ${expiringProducts.length} medicine${expiringProducts.length > 1 ? 's' : ''} expiring soon. `;
      } else {
        summary += 'No medicines are expiring soon. ';
      }

      const utterance = new SpeechSynthesisUtterance(summary);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200 sticky top-0 z-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <BeakerIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="heading-1">SmartCare Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleVoiceSummary}
              disabled={speaking}
              className={`btn ${speaking ? 'bg-primary-100 text-primary-400' : 'btn-secondary'} flex items-center gap-2`}
            >
              <SpeakerWaveIcon className={`h-5 w-5 ${speaking ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">Voice Summary</span>
            </button>
            <button onClick={handlePrint} className="btn btn-secondary flex items-center gap-2">
              <PrinterIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="btn btn-secondary flex items-center gap-2"
            >
              <UserCircleIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Profile</span>
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="btn btn-danger flex items-center gap-2"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="heading-2">Welcome back, {user?.name}!</h2>
          <p className="text-muted mt-1">Here's your health overview for today.</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Medicine Card */}
          <div className="card hover:border-primary-200">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-primary-50 p-3 rounded-xl">
                <ClockIcon className="h-8 w-8 text-primary-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${medicines.length > 0 ? 'bg-success-50 text-success-600' : 'bg-secondary-100 text-secondary-500'}`}>
                {medicines.length} Scheduled
              </span>
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2">Today's Medicines</h3>
            <div className="space-y-3">
              {medicines.length > 0 ? (
                medicines.slice(0, 3).map((med, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-secondary-800">{med.name}</p>
                      <p className="text-xs text-secondary-500">{med.dosageTimes[0]?.time} - {med.dosageTimes[0]?.label}</p>
                    </div>
                    <span className="text-xs font-medium text-primary-600">{med.dosage}</span>
                  </div>
                ))
              ) : (
                <p className="text-secondary-500 italic">No medicines scheduled for today.</p>
              )}
            </div>
            <button onClick={() => navigate('/medicines')} className="w-full mt-4 text-primary-600 font-semibold text-sm flex items-center justify-center gap-1 hover:text-primary-700">
              View All Medicines <CalendarIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Appointment Card */}
          <div className="card hover:border-primary-200">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-success-50 p-3 rounded-xl">
                <CalendarIcon className="h-8 w-8 text-success-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${appointments.length > 0 ? 'bg-primary-50 text-primary-600' : 'bg-secondary-100 text-secondary-500'}`}>
                {appointments.length} Upcoming
              </span>
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2">Appointments</h3>
            <div className="space-y-3">
              {appointments.length > 0 ? (
                appointments.slice(0, 2).map((app, idx) => (
                  <div key={idx} className="p-3 bg-secondary-50 rounded-lg">
                    <p className="font-semibold text-secondary-800">Dr. {app.doctorName}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-secondary-500">{new Date(app.date).toLocaleDateString()}</p>
                      <p className="text-xs font-medium text-success-600">{app.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-secondary-500 italic">No upcoming appointments.</p>
              )}
            </div>
            <button onClick={() => navigate('/appointments')} className="w-full mt-4 text-primary-600 font-semibold text-sm flex items-center justify-center gap-1 hover:text-primary-700">
              Manage Appointments <CalendarIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Expiry Card */}
          <div className="card hover:border-danger-200">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-danger-50 p-3 rounded-xl">
                <BeakerIcon className="h-8 w-8 text-danger-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${expiringProducts.length > 0 ? 'bg-danger-100 text-danger-600' : 'bg-success-50 text-success-600'}`}>
                {expiringProducts.length} Alert{expiringProducts.length !== 1 ? 's' : ''}
              </span>
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2">Expiry Alerts</h3>
            <div className="space-y-3">
              {expiringProducts.length > 0 ? (
                expiringProducts.slice(0, 3).map((prod, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-danger-50/50 rounded-lg border border-danger-100">
                    <div>
                      <p className="font-semibold text-danger-900">{prod.name}</p>
                      <p className="text-xs text-danger-600">Expires: {new Date(prod.expiryDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-secondary-500 italic">All medicines are within safe dates.</p>
              )}
            </div>
            <button onClick={() => navigate('/expiry')} className="w-full mt-4 text-danger-600 font-semibold text-sm flex items-center justify-center gap-1 hover:text-danger-700">
              Check Inventory <ArrowRightOnRectangleIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button onClick={() => navigate('/medicines')} className="card flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
            <div className="bg-primary-100 p-4 rounded-full mb-4">
              <BeakerIcon className="h-8 w-8 text-primary-600" />
            </div>
            <h4 className="font-bold text-secondary-900">Add Medicine</h4>
            <p className="text-sm text-secondary-500 mt-1">Schedule new dosages</p>
          </button>
          
          <button onClick={() => navigate('/appointments')} className="card flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
            <div className="bg-success-100 p-4 rounded-full mb-4">
              <CalendarIcon className="h-8 w-8 text-success-600" />
            </div>
            <h4 className="font-bold text-secondary-900">Book Appointment</h4>
            <p className="text-sm text-secondary-500 mt-1">Visit your doctor</p>
          </button>

          <button onClick={() => navigate('/expiry')} className="card flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
            <div className="bg-warning-100 p-4 rounded-full mb-4">
              <ClockIcon className="h-8 w-8 text-warning-600" />
            </div>
            <h4 className="font-bold text-secondary-900">Track Expiry</h4>
            <p className="text-sm text-secondary-500 mt-1">Check stock dates</p>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
