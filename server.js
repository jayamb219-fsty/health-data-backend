const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory patient database (in a real app, this would be a database)
const patients = {
  '123': {
    id: '123',
    name: 'Furious Styles',
    dob: '1990-01-01',
    gender: 'male',
    email: 'jayamb219@gmail.com',
    address: 'Brooklyn, NY 11238',
    medication: 'Lisinopril 10mg',
    dosage: 'Take 1 tablet by mouth daily',
    allergy: 'No known drug allergies'
  }
};

// Access log (will save to file)
const accessLog = [];

// Endpoint: Get patient data
app.get('/api/patient/:id', (req, res) => {
  const patientId = req.params.id;
  const patient = patients[patientId];

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  // Log the access
  const accessEntry = {
    patientId: patientId,
    timestamp: new Date().toISOString(),
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  };
  
  accessLog.push(accessEntry);
  console.log('Access logged:', accessEntry);

  // Save log to file
  fs.writeFileSync(
    path.join(__dirname, 'access-log.json'),
    JSON.stringify(accessLog, null, 2)
  );

  // Return patient data
  res.json(patient);
});

// Endpoint: Get access logs for a patient
app.get('/api/patient/:id/logs', (req, res) => {
  const patientId = req.params.id;
  const patientLogs = accessLog.filter(log => log.patientId === patientId);
  res.json(patientLogs);
});

// Endpoint: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Health Data Backend running on http://localhost:${PORT}`);
  console.log(`📊 Access logs will be saved to access-log.json`);
});