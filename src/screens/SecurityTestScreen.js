import React, { useState, useContext } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Divider, Text, ActivityIndicator } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { apiMethods } from '../services/api';

const SecurityTestScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, success, message) => {
    setTestResults(prev => [...prev, { test, success, message, timestamp: new Date() }]);
  };

  const testEndpoint = async (name, apiCall, expectedToFail = false) => {
    try {
      setLoading(true);
      const response = await apiCall();
      if (expectedToFail) {
        addTestResult(name, false, `Expected failure but got success: ${response.status}`);
      } else {
        addTestResult(name, true, `Success: ${response.status || 'OK'}`);
      }
    } catch (error) {
      if (expectedToFail) {
        addTestResult(name, true, `Expected failure: ${error.response?.status || error.message}`);
      } else {
        addTestResult(name, false, `Unexpected failure: ${error.response?.status || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const runSecurityTests = async () => {
    setTestResults([]);
    Alert.alert('Security Tests', 'This will test various API endpoints to verify security rules are working correctly.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Run Tests', onPress: async () => { await runTests(); } },
    ]);
  };

  const runTests = async () => {
    await testEndpoint('GET /donors (Admin Only)', () => apiMethods.getDonors(), user?.role !== 'admin');
    await testEndpoint('POST /alerts (Admin Only)', () => apiMethods.createAlert({ title: 'Test Alert', message: 'This is a test', bloodGroup: 'A_POSITIVE', urgency: 'HIGH' }), user?.role !== 'admin');
    await testEndpoint('GET /donors/me (Donor Only)', () => apiMethods.getDonorProfile(), user?.role !== 'DONOR');
    await testEndpoint('GET /reports/donations (Admin Only)', () => apiMethods.getDonationReports(), user?.role !== 'admin');
    await testEndpoint('GET /alerts (All Authenticated)', () => apiMethods.getAlerts(), false);
    await testEndpoint('GET /auth/profile (All Authenticated)', () => apiMethods.getUserProfile(), false);
  };

  const clearResults = () => { setTestResults([]); };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 16 }}>
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Title>Current User</Title>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Text style={{ marginRight: 8 }}>Role:</Text>
              <Chip mode="outlined" textStyle={{ fontWeight: 'bold' }} style={{ backgroundColor: user?.role === 'admin' ? '#e3f2fd' : '#f3e5f5' }}>
                {user?.role?.toUpperCase() || 'UNKNOWN'}
              </Chip>
            </View>
            <Paragraph style={{ marginTop: 8 }}>Email: {user?.email || 'Not logged in'}</Paragraph>
          </Card.Content>
        </Card>
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Title>Security Rules</Title>
            <Divider style={{ marginVertical: 8 }} />
            <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Admin Only:</Text>
            <Text>GET /donors - View all donors</Text>
            <Text>POST /alerts - Create emergency alerts</Text>
            <Text>GET /reports/* - All reports</Text>
            <Text style={{ fontWeight: 'bold', marginTop: 12, marginBottom: 4 }}>Donor Only:</Text>
            <Text>GET /donors/me - View own profile</Text>
            <Text style={{ fontWeight: 'bold', marginTop: 12, marginBottom: 4 }}>All Authenticated:</Text>
            <Text>GET /alerts - View emergency alerts</Text>
            <Text>GET /auth/profile - View own user profile</Text>
          </Card.Content>
        </Card>
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Title>Run Tests</Title>
            <Paragraph style={{ marginBottom: 12 }}>Click the button below to test API security rules based on your current role.</Paragraph>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button mode="contained" onPress={runSecurityTests} disabled={loading} style={{ flex: 1 }}>Run Security Tests</Button>
              {testResults.length > 0 && <Button mode="outlined" onPress={clearResults} disabled={loading}>Clear</Button>}
            </View>
          </Card.Content>
        </Card>
        {loading && (
          <Card style={{ marginBottom: 16, backgroundColor: '#fff3cd' }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator size="small" style={{ marginRight: 8 }} />
                <Text>Running security tests...</Text>
              </View>
            </Card.Content>
          </Card>
        )}
        {testResults.length > 0 && (
          <Card style={{ marginBottom: 16 }}>
            <Card.Content>
              <Title>Test Results</Title>
              <Divider style={{ marginVertical: 8 }} />
              {testResults.map((result, index) => (
                <View key={index} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Chip mode="outlined" textStyle={{ fontSize: 12 }} style={{ backgroundColor: result.success ? '#e8f5e8' : '#ffeaea', marginRight: 8 }}>
                      {result.success ? 'PASS' : 'FAIL'}
                    </Chip>
                    <Text style={{ fontWeight: 'bold', flex: 1 }}>{result.test}</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: '#666' }}>{result.message}</Text>
                  {index < testResults.length - 1 && <Divider style={{ marginTop: 8 }} />}
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
        <View style={{ marginTop: 24, marginBottom: 32 }}>
          <Button mode="outlined" onPress={() => navigation.goBack()}>Back to Dashboard</Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default SecurityTestScreen;
