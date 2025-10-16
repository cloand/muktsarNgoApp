import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Button } from 'react-native-paper';
import DonorLastDonationModal from './DonorLastDonationModal';

const AddDonationButton = ({ donor, onSuccess, style }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSuccess = () => {
    setModalVisible(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <>
      <Button
        mode="contained"
        onPress={() => setModalVisible(true)}
        style={[{ backgroundColor: '#4CAF50' }, style]}
        icon="plus"
        compact
      >
        Add Donation
      </Button>
      
      <DonorLastDonationModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        donor={donor}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default AddDonationButton;
