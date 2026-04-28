const Medicine = require('../models/Medicine');

const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addMedicine = async (req, res) => {
  try {
    const { name, dosageTimes, repeat, notes } = req.body;
    
    const medicine = new Medicine({
      userId: req.user._id,
      name,
      dosageTimes,
      repeat,
      notes
    });

    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dosageTimes, repeat, status, notes } = req.body;

    const medicine = await Medicine.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { name, dosageTimes, repeat, status, notes, lastTaken: status === 'Taken' ? new Date() : undefined },
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTodayMedicines = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const medicines = await Medicine.find({ 
      userId: req.user._id,
      repeat: true
    });

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getTodayMedicines
};
