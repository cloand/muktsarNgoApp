# 🩸 Donor Eligibility Feature Implementation

## Overview
Comprehensive donor eligibility checking system that automatically determines donor availability based on last donation date, gender, and medical guidelines.

## 🔧 **Core Features Implemented**

### ✅ **Eligibility Calculation**
- **90-day rule for males** - Standard blood donation interval
- **120-day rule for females** - Extended interval for female donors
- **Real-time status updates** - Dynamic availability checking
- **Visual indicators** - Color-coded status chips and badges

### ✅ **Helper Functions**
Located in `src/utils/constants.js`:

```javascript
// Check donor eligibility
export const checkEligibility = (lastDonationDate, gender = 'male') => {
  // Returns comprehensive eligibility information
  return {
    isEligible: boolean,
    status: 'Available' | 'Unavailable',
    reason: string,
    daysUntilEligible: number,
    daysSinceLastDonation: number,
    nextEligibleDate: Date | null
  };
};
```

## 📊 **Eligibility Rules**

### **Donation Intervals:**
- **Male Donors**: 90 days minimum between donations
- **Female Donors**: 120 days minimum between donations
- **First-time Donors**: Immediately available (no previous donation)

### **Additional Criteria:**
- **Age Range**: 18-65 years
- **Minimum Weight**: 50 kg
- **Health Status**: Active and healthy

## 🎨 **Visual Indicators**

### **Status Chips:**
- 🟢 **Available** - Green chip with check-circle icon
- 🔴 **Unavailable** - Red chip with clock-alert icon

### **Unavailable Badge:**
- **Red badge** showing days remaining until eligible
- **Format**: "15d left" (days until next donation allowed)

### **Eligibility Information:**
- **Days until eligible** - Countdown display
- **Next eligible date** - Formatted date display
- **Reason text** - Explanation of status

## 📱 **DonorListScreen Updates**

### **Enhanced Donor Cards:**
```javascript
const eligibility = getDonorEligibility(item);

// Status chip with icon
<Chip 
  icon={eligibility.icon}
  style={{ backgroundColor: eligibility.color }}
>
  {eligibility.status}
</Chip>

// Unavailable badge
{!eligibility.isEligible && (
  <View style={styles.unavailableBadge}>
    <Text>{eligibility.daysUntilEligible}d left</Text>
  </View>
)}
```

### **Contact Button Logic:**
- **Disabled for unavailable donors** - Prevents contact attempts
- **Visual feedback** - Grayed out appearance
- **Smart filtering** - Search includes eligibility status

## 🔍 **Enhanced Search Functionality**

### **Search Criteria:**
- **Name** - Donor full name
- **Blood Group** - A+, B+, O+, AB+, etc.
- **Eligibility Status** - "Available", "Unavailable"
- **Phone Number** - Contact information
- **Email Address** - Email search
- **Gender** - Male/Female filtering

### **Search Examples:**
- `"available"` - Shows only available donors
- `"unavailable"` - Shows only unavailable donors
- `"O+"` - Shows all O+ blood group donors
- `"9876"` - Searches phone numbers

## 📊 **Mock Data Examples**

### **Available Donor:**
```javascript
{
  id: '2',
  name: 'Jane Smith',
  bloodGroup: 'A+',
  lastDonationDate: '2024-08-15', // 120+ days ago
  gender: 'female',
  // Result: Available (eligible to donate)
}
```

### **Unavailable Donor:**
```javascript
{
  id: '1', 
  name: 'John Doe',
  bloodGroup: 'O+',
  lastDonationDate: '2024-12-01', // Recent donation
  gender: 'male',
  // Result: Unavailable (must wait ~60 days)
}
```

### **First-time Donor:**
```javascript
{
  id: '5',
  name: 'Amit Singh', 
  bloodGroup: 'O-',
  lastDonationDate: null, // No previous donation
  gender: 'male',
  // Result: Available (no restrictions)
}
```

## 🎯 **Eligibility Response Format**

```javascript
{
  isEligible: false,
  status: "Unavailable",
  reason: "Must wait 25 more days",
  daysUntilEligible: 25,
  daysSinceLastDonation: 65,
  nextEligibleDate: "2025-01-15T00:00:00.000Z"
}
```

## 🎨 **Styling Implementation**

### **Status Container:**
```javascript
statusContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},
```

### **Unavailable Badge:**
```javascript
unavailableBadge: {
  backgroundColor: '#FF5722',
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 10,
  minWidth: 50,
  alignItems: 'center',
},
```

### **Color Scheme:**
- **Available**: `#4CAF50` (Green)
- **Unavailable**: `#FF5722` (Red/Orange)
- **Unknown**: `#9E9E9E` (Gray)

## 🔄 **Real-time Updates**

### **Dynamic Calculation:**
- **Recalculated on each render** - Always current
- **Date-based logic** - Automatic status changes
- **No manual updates needed** - Self-maintaining system

### **Automatic Status Changes:**
- **Daily updates** - Status changes as time passes
- **Countdown display** - Shows remaining days
- **Future date calculation** - Next eligible date

## 📋 **Integration Points**

### **Backend API Expected Format:**
```javascript
{
  "id": "1",
  "name": "John Doe",
  "bloodGroup": "O+",
  "lastDonationDate": "2024-12-01",
  "gender": "male",
  "age": 28,
  "weight": 70,
  "phone": "+91 9876543210",
  "email": "john@example.com"
}
```

### **Required Fields:**
- ✅ `lastDonationDate` - ISO date string or null
- ✅ `gender` - "male" or "female"
- ✅ `bloodGroup` - Standard blood group notation
- ✅ `name` - Donor full name

## 🚀 **Usage Examples**

### **Check Single Donor:**
```javascript
import { checkEligibility } from '../utils/constants';

const eligibility = checkEligibility('2024-12-01', 'male');
console.log(eligibility.status); // "Unavailable"
console.log(eligibility.daysUntilEligible); // 25
```

### **Filter Available Donors:**
```javascript
const availableDonors = donors.filter(donor => {
  const eligibility = checkEligibility(donor.lastDonationDate, donor.gender);
  return eligibility.isEligible;
});
```

### **Get Next Eligible Date:**
```javascript
const eligibility = checkEligibility('2024-12-01', 'female');
const nextDate = formatNextEligibleDate(eligibility.nextEligibleDate);
console.log(nextDate); // "Mar 31, 2025"
```

## 🔧 **Customization Options**

### **Modify Donation Intervals:**
```javascript
export const DONATION_ELIGIBILITY = {
  MALE_MINIMUM_DAYS: 90,     // Change male interval
  FEMALE_MINIMUM_DAYS: 120,  // Change female interval
  MINIMUM_AGE: 18,           // Minimum donor age
  MAXIMUM_AGE: 65,           // Maximum donor age
  MINIMUM_WEIGHT: 50,        // Minimum weight (kg)
};
```

### **Custom Status Colors:**
```javascript
export const getEligibilityColor = (isEligible) => {
  return isEligible ? '#4CAF50' : '#FF5722'; // Customize colors
};
```

## ✅ **Benefits**

### **For Blood Banks:**
- **Accurate donor tracking** - Know who can donate when
- **Reduced rejections** - Don't contact ineligible donors
- **Better planning** - Forecast donor availability
- **Compliance** - Follow medical guidelines

### **For Donors:**
- **Clear status** - Know eligibility at a glance
- **Countdown display** - See when next donation is possible
- **No confusion** - Automatic status updates
- **Better experience** - Only contacted when eligible

The donor eligibility system is now fully functional and provides comprehensive tracking of donor availability based on medical guidelines!
