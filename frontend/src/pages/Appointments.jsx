import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { appointmentAPI } from '../services/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    doctorName: '',
    date: '',
    time: '10:00 AM',
    reminderDaysBefore: 3,
    notes: '',
    isMonthlyReminder: false
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAppointments();
    if (location.search.includes('action=add')) {
      setShowAddForm(true);
    }
  }, [location]);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.getAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        await appointmentAPI.updateAppointment(editingAppointment._id, formData);
      } else {
        await appointmentAPI.addAppointment(formData);
      }
      fetchAppointments();
      resetForm();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      doctorName: appointment.doctorName,
      date: new Date(appointment.date).toISOString().split('T')[0],
      time: appointment.time,
      reminderDaysBefore: appointment.reminderDaysBefore,
      notes: appointment.notes || '',
      isMonthlyReminder: appointment.isMonthlyReminder || false
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentAPI.deleteAppointment(id);
        fetchAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      doctorName: '',
      date: '',
      time: '10:00 AM',
      reminderDaysBefore: 3,
      notes: '',
      isMonthlyReminder: false
    });
    setEditingAppointment(null);
    setShowAddForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const isUpcoming = (date) => {
    return new Date(date) >= new Date().setHours(0, 0, 0, 0);
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
      <header className="bg-white border-b border-secondary-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-secondary-100 rounded-full transition-colors">
              <ArrowLeftIcon className="h-6 w-6 text-secondary-600" />
            </button>
            <h1 className="heading-1">Appointments</h1>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Book New</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAddForm && (
          <div className="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-card w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-6 py-4 border-b border-secondary-100 flex justify-between items-center bg-primary-50/30">
                <h2 className="text-xl font-bold text-secondary-900">
                  {editingAppointment ? 'Edit Appointment' : 'Book New Appointment'}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-secondary-100 rounded-full">
                  <PlusIcon className="h-6 w-6 text-secondary-400 rotate-45" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="label">Doctor Name</label>
                    <input
                      type="text"
                      required
                      className="input"
                      placeholder="e.g., Dr. Smith"
                      value={formData.doctorName}
                      onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="label">Date</label>
                    <input
                      type="date"
                      required
                      className="input"
                      value={formData.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="label">Time</label>
                    <input
                      type="text"
                      required
                      className="input"
                      placeholder="10:00 AM"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Reminder Days Before</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    className="input"
                    value={formData.reminderDaysBefore}
                    onChange={(e) => setFormData({...formData, reminderDaysBefore: parseInt(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="label">Notes (Optional)</label>
                  <textarea
                    className="input min-h-[80px]"
                    placeholder="Symptoms, questions for doctor..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="monthly"
                    className="h-5 w-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    checked={formData.isMonthlyReminder}
                    onChange={(e) => setFormData({...formData, isMonthlyReminder: e.target.checked})}
                  />
                  <label htmlFor="monthly" className="text-sm font-medium text-secondary-700">
                    Recurring monthly appointment
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={resetForm} className="btn btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingAppointment ? 'Update' : 'Book'} Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="card group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl transition-colors ${isUpcoming(appointment.date) ? 'bg-success-50 text-success-600' : 'bg-secondary-100 text-secondary-400'}`}>
                  <PlusIcon className="h-8 w-8" />
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleEdit(appointment)}
                    className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(appointment._id)}
                    className="p-2 text-secondary-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-secondary-900 mb-1">Dr. {appointment.doctorName}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
                {appointment.isMonthlyReminder && (
                  <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-xs font-bold uppercase tracking-wider">
                    Monthly
                  </span>
                )}
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm p-2 bg-secondary-50 rounded-lg">
                  <span className="text-secondary-600 font-medium">Date</span>
                  <span className="text-secondary-900 font-bold">{new Date(appointment.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 bg-secondary-50 rounded-lg">
                  <span className="text-secondary-600 font-medium">Time</span>
                  <span className="text-primary-700 font-bold bg-white px-2 py-1 rounded shadow-sm">{appointment.time}</span>
                </div>
              </div>

              {appointment.notes && (
                <p className="text-sm text-secondary-500 mb-2 bg-secondary-50/50 p-3 rounded-lg border border-dashed border-secondary-200">
                  {appointment.notes}
                </p>
              )}
              
              <p className="text-xs text-secondary-400 text-right">
                Reminder {appointment.reminderDaysBefore} days before
              </p>
            </div>
          ))}
          
          {appointments.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center">
              <div className="bg-secondary-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusIcon className="h-10 w-10 text-secondary-400" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900">No appointments booked</h3>
              <p className="text-secondary-500 mb-6">Keep track of your medical visits.</p>
              <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
                Book Your First Appointment
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Appointments;
