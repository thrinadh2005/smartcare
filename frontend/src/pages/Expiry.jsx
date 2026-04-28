import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ArrowLeftIcon,
  CameraIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { productAPI } from '../services/api';

const Expiry = () => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    expiryDate: '',
    image: null,
    ocrExtractedText: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchProducts();
    if (location.search.includes('action=add')) {
      setShowAddForm(true);
    }
  }, [location]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('expiryDate', formData.expiryDate);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      if (formData.ocrExtractedText) {
        formDataToSend.append('ocrExtractedText', formData.ocrExtractedText);
      }

      if (editingProduct) {
        await productAPI.updateProduct(editingProduct._id, {
          name: formData.name,
          expiryDate: formData.expiryDate
        });
      } else {
        await productAPI.addProduct(formDataToSend);
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      expiryDate: new Date(product.expiryDate).toISOString().split('T')[0],
      image: null,
      ocrExtractedText: product.ocrExtractedText || ''
    });
    setPreviewImage(product.image);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleOCR = async () => {
    if (!formData.image) return;

    setOcrLoading(true);
    try {
      // Create a temporary canvas to extract text from image
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // For demo purposes, we'll simulate OCR extraction
        // In a real implementation, you'd use Tesseract.js here
        setTimeout(() => {
          const simulatedText = `EXP: ${formData.expiryDate || '2025-12-31'}\nBATCH: ABC123\nMFG: 2024-01-01`;
          setFormData({ ...formData, ocrExtractedText: simulatedText });
          
          // Try to extract expiry date from the text
          const dateMatch = simulatedText.match(/(?:EXP|EXPIRY|BEST BEFORE)[:\s]*(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})/i);
          if (dateMatch) {
            const extractedDate = dateMatch[1].replace(/\//g, '-');
            setFormData(prev => ({ ...prev, expiryDate: extractedDate }));
          }
          
          setOcrLoading(false);
        }, 2000);
      };
      img.src = previewImage;
    } catch (error) {
      console.error('OCR error:', error);
      setOcrLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      expiryDate: '',
      image: null,
      ocrExtractedText: ''
    });
    setPreviewImage(null);
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Expiring Soon':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
            <h1 className="heading-1">Expiry Tracker</h1>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Add Medicine</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAddForm && (
          <div className="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-card w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-6 py-4 border-b border-secondary-100 flex justify-between items-center bg-primary-50/30">
                <h2 className="text-xl font-bold text-secondary-900">
                  {editingProduct ? 'Edit Medicine' : 'Add New Medicine'}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-secondary-100 rounded-full">
                  <PlusIcon className="h-6 w-6 text-secondary-400 rotate-45" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-4">
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
                    <label className="label">Expiry Date</label>
                    <input
                      type="date"
                      required
                      className="input"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="label">Medicine Image / Label Scan</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-secondary-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
                      {previewImage ? (
                        <div className="space-y-2 text-center">
                          <img src={previewImage} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-soft" />
                          <button type="button" onClick={() => {setPreviewImage(null); setFormData({...formData, image: null})}} className="text-sm text-danger-600 font-semibold">Remove Image</button>
                        </div>
                      ) : (
                        <div className="space-y-1 text-center">
                          <CameraIcon className="mx-auto h-12 w-12 text-secondary-400" />
                          <div className="flex text-sm text-secondary-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-semibold text-primary-600 hover:text-primary-500">
                              <span>Upload a photo</span>
                              <input type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                            </label>
                          </div>
                          <p className="text-xs text-secondary-500">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {previewImage && !editingProduct && (
                    <button
                      type="button"
                      onClick={handleOCR}
                      disabled={ocrLoading}
                      className="w-full btn btn-secondary flex items-center justify-center gap-2"
                    >
                      {ocrLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                      ) : (
                        <DocumentTextIcon className="h-5 w-5" />
                      )}
                      Scan for Expiry Date
                    </button>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={resetForm} className="btn btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingProduct ? 'Update' : 'Save'} Medicine
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="card group overflow-hidden">
              {product.image && (
                <div className="relative h-40 -mx-6 -mt-6 mb-4">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              )}
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-secondary-900">{product.name}</h3>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(product)} className="p-1.5 text-secondary-400 hover:text-primary-600 rounded-lg">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="p-1.5 text-secondary-400 hover:text-danger-600 rounded-lg">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm p-2 bg-secondary-50 rounded-lg">
                  <span className="text-secondary-600 font-medium">Expiry Date</span>
                  <span className="text-secondary-900 font-bold">{new Date(product.expiryDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm p-2 bg-secondary-50 rounded-lg">
                  <span className="text-secondary-600 font-medium">Days Left</span>
                  <span className={`font-bold ${getDaysUntilExpiry(product.expiryDate) <= 7 ? 'text-danger-600' : 'text-success-600'}`}>
                    {getDaysUntilExpiry(product.expiryDate)} days
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {products.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center">
              <div className="bg-secondary-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CameraIcon className="h-10 w-10 text-secondary-400" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900">Inventory is empty</h3>
              <p className="text-secondary-500 mb-6">Scan your medicine labels to track expiry dates automatically.</p>
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

export default Expiry;
