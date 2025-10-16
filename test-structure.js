// Simple test to verify project structure
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'App.js',
  'package.json',
  'babel.config.js',
  'app.json',
  'src/screens/LoginScreen.js',
  'src/screens/HomeScreen.js',
  'src/screens/DonorListScreen.js',
  'src/screens/AddDonationScreen.js',
  'src/screens/EmergencyAlertScreen.js',
  'src/navigation/AppNavigator.js',
  'src/components/Button.js',
  'src/components/Header.js',
  'src/services/ApiService.js',
  'src/services/AuthService.js',
  'src/context/AuthContext.js',
  'src/context/AppContext.js',
  'src/utils/constants.js',
  'src/utils/helpers.js',
];

console.log('🔍 Checking project structure...\n');

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('🎉 All required files are present!');
  console.log('📱 Your React Native (Expo) project is ready!');
  console.log('\nNext steps:');
  console.log('1. cd muktsarngo');
  console.log('2. npm install (if not already done)');
  console.log('3. npm start');
} else {
  console.log('⚠️  Some files are missing. Please check the structure.');
}

console.log('\n📋 Project Features:');
console.log('• Login Screen (Initial Route)');
console.log('• Home Dashboard');
console.log('• Donor List Management');
console.log('• Add Donation Form');
console.log('• Emergency Alert System');
console.log('• Clean Navigation Structure');
console.log('• Functional Components with Hooks');
console.log('• React Context for State Management');
