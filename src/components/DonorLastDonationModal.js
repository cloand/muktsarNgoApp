import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Button,
  TextInput,
  Card,
  Title,
  Paragraph,
  Chip,
  useTheme,
} from 'react-native-paper';
import AuthService from '../services/AuthService';
import { BASE_URL } from '../config/config';

const DonorLastDonationModal = ({ visible, onDismiss, donor, onSuccess }) => {
  const theme = useTheme();
  const [donationDate, setDonationDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);

  const handleUpdateDonation = async () => {
    if (!donationDate) {
      Alert.alert('Error', 'Please select a donation date');
      return;
    }

    // Validate date is not in the future
    const selectedDate = new Date(donationDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today

    if (selectedDate > today) {
      Alert.alert('Error', 'Donation date cannot be in the future');
      return;
    }

    setLoading(true);

    try {
      // AuthService is a singleton instance, not a class
      const token = await AuthService.getToken();

      if (!token) {
        Alert.alert('Error', 'Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      // Use the BASE_URL from config
      const apiUrl = `${BASE_URL}/donors/${donor.id}/last-donation`;

      console.log('Making API call to:', apiUrl);
      console.log('With token:', token ? 'Present' : 'Missing');

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          lastDonationDate: donationDate + 'T00:00:00.000Z'
        }),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const updatedDonor = await response.json();
        Alert.alert(
          'Success',
          `Donation recorded successfully for ${donor.name}!\nTotal donations: ${updatedDonor.totalDonations}`,
          [
            {
              text: 'OK',
              onPress: () => {
                onDismiss();
                if (onSuccess) {
                  onSuccess();
                }
              },
            },
          ]
        );
      } else {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        
        let errorMessage = 'Failed to update donation date';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Error updating donation:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!donor) return null;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: 'transparent',
          // padding: 20,
          margin: 20,
          borderRadius: 8,
        }}
      >
        <Card>
          <Card.Content>
            <Title>Add Donation Record</Title>
            
            <View style={{ marginVertical: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                {donor.name}
              </Text>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>
                {donor.email} • {donor.phone}
              </Text>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <Chip mode="outlined" style={{ marginRight: 8 }}>
                  {donor.bloodGroup}
                </Chip>
                <Chip mode="outlined">
                  Total: {donor.totalDonations || 0}
                </Chip>
              </View>
              {donor.lastDonationDate && (
                <Text style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
                  Last Donation: {new Date(donor.lastDonationDate).toLocaleDateString()}
                </Text>
              )}
            </View>

            <TextInput
              label="Donation Date"
              value={donationDate}
              onChangeText={setDonationDate}
              mode="outlined"
              placeholder="YYYY-MM-DD"
              style={{ marginBottom: 16 }}
            />

            <Paragraph style={{ fontSize: 12, color: theme.colors.onSurfaceVariant }}>
              Note: This will automatically increment the total donation count.
            </Paragraph>
          </Card.Content>

          <Card.Actions style={{ justifyContent: 'flex-end' }}>
            <Button onPress={onDismiss} disabled={loading}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleUpdateDonation}
              loading={loading}
              disabled={loading}
            >
              Record Donation
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};

export default DonorLastDonationModal;
