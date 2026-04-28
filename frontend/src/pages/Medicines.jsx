import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { medicineAPI } from '../services/api';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    dosageTimes: [{ label: 'Early Morning (Before Tiffin)', time: '08:00 AM' }],
    repeat: true,
    notes: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchMedicines();
    if (location.search.includes('action=add')) {
      setShowAddForm(true);
    }
  }, [location]);

  const fetchMedicines = async () => {
    try {
      const response = await medicineAPI.getMedicines();
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMedicine) {
        await medicineAPI.updateMedicine(editingMedicine._id, formData);
      } else {
        await medicineAPI.addMedicine(formData);
      }
      fetchMedicines();
      resetForm();
    } catch (error) {
      console.error('Error saving medicine:', error);
    }
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      dosageTimes: medicine.dosageTimes,
      repeat: medicine.repeat,
      notes: medicine.notes || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await medicineAPI.deleteMedicine(id);
        fetchMedicines();
      } catch (error) {
        console.error('Error deleting medicine:', error);
      }
    }
  };

  const handleStatusUpdate = async (medicine, newStatus) => {
    try {
      await medicineAPI.updateMedicine(medicine._id, {
        ...medicine,
        status: newStatus
      });
      fetchMedicines();
    } catch (error) {
      console.error('Error updating medicine status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      dosageTimes: [{ label: 'Early Morning (Before Tiffin)', time: '08:00 AM' }],
      repeat: true,
      notes: ''
    });
    setEditingMedicine(null);
    setShowAddForm(false);
  };

  const addDosageTime = () => {
    setFormData({
      ...formData,
      dosageTimes: [...formData.dosageTimes, { label: 'Early Morning (Before Tiffin)', time: '08:00 AM' }]
    });
  };

  const removeDosageTime = (index) => {
    setFormData({
      ...formData,
      dosageTimes: formData.dosageTimes.filter((_, i) => i !== index)
    });
  };

  const updateDosageTime = (index, field, value) => {
    const updatedDosageTimes = [...formData.dosageTimes];
    updatedDosageTimes[index][field] = value;
    setFormData({
      ...formData,
      dosageTimes: updatedDosageTimes
    });
  };

  const dosageOptions = [
    'Early Morning (Before Tiffin)',
    'After Tiffin',
    'Before Lunch',
    'After Lunch',
    'Before Dinner',
    'After Dinner'
  ];

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
            <h1 className="heading-1">My Medicines</h1>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Add New</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAddForm && (
          <div className="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-card w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-6 py-4 border-b border-secondary-100 flex justify-between items-center bg-primary-50/30">
                <h2 className="text-xl font-bold text-secondary-900">
                  {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-secondary-100 rounded-full">
                  <XCircleIcon className="h-6 w-6 text-secondary-400" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="label">Medicine Name</label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="e.g., Paracetamol"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="label">Dosage Schedule</label>
                  <div className="space-y-3">
                    {formData.dosageTimes.map((dt, index) => (
                      <div key={index} className="flex gap-2">
                        <select
                          className="input flex-1"
                          value={dt.label}
                          onChange={(e) => updateDosageTime(index, 'label', e.target.value)}
                        >
                          {dosageOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          className="input w-32"
                          placeholder="08:00 AM"
                          value={dt.time}
                          onChange={(e) => updateDosageTime(index, 'time', e.target.value)}
                        />
                        {formData.dosageTimes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDosageTime(index)}
                            className="p-2 text-danger-500 hover:bg-danger-50 rounded-lg"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addDosageTime}
                      className="text-sm text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1"
                    >
                      <PlusIcon className="h-4 w-4" /> Add another time
                    </button>
                  </div>
                </div>

                <div>
                  <label className="label">Notes (Optional)</label>
                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Special instructions..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="repeat"
                    className="h-5 w-5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    checked={formData.repeat}
                    onChange={(e) => setFormData({...formData, repeat: e.target.checked})}
                  />
                  <label htmlFor="repeat" className="text-sm font-medium text-secondary-700">
                    Repeat daily
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={resetForm} className="btn btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingMedicine ? 'Update' : 'Add'} Medicine
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((medicine) => (
            <div key={medicine._id} className="card group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary-50 p-3 rounded-xl group-hover:bg-primary-100 transition-colors">
                  <BeakerIcon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleEdit(medicine)}
                    className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(medicine._id)}
                    className="p-2 text-secondary-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-secondary-900 mb-2">{medicine.name}</h3>
              
              <div className="space-y-3 mb-6">
                {medicine.dosageTimes.map((dt, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm p-2 bg-secondary-50 rounded-lg">
                    <span className="text-secondary-600 font-medium">{dt.label}</span>
                    <span className="text-primary-700 font-bold bg-white px-2 py-1 rounded shadow-sm">{dt.time}</span>
                  </div>
                ))}
              </div>

              {medicine.notes && (
                <p className="text-sm text-secondary-500 mb-6 bg-secondary-50/50 p-3 rounded-lg border border-dashed border-secondary-200">
                  {medicine.notes}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusUpdate(medicine, 'Taken')}
                  className={`flex-1 btn ${medicine.status === 'Taken' ? 'btn-success' : 'btn-secondary'} flex items-center justify-center gap-2`}
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  Taken
                </button>
                <button
                  onClick={() => handleStatusUpdate(medicine, 'Pending')}
                  className={`flex-1 btn ${medicine.status === 'Pending' ? 'bg-warning-500 text-white hover:bg-warning-600' : 'btn-secondary'} flex items-center justify-center gap-2`}
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  Pending
                </button>
              </div>
            </div>
          ))}
          
          {medicines.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center">
              <div className="bg-secondary-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BeakerIcon className="h-10 w-10 text-secondary-400" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900">No medicines added yet</h3>
              <p className="text-secondary-500 mb-6">Start by adding your first medication schedule.</p>
              <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
                Add Your First Medicine
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Medicines;
