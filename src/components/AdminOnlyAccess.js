import React from 'react';
import { View } from 'react-native';
import { Card, Title, Paragraph, Button, Icon } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../config/config';

/**
 * AdminOnlyAccess Component
 * 
 * This component wraps content that should only be visible to admin users.
 * It checks the user's role and either shows the content or displays an access denied message.
 * 
 * Props:
 * - children: Content to show if user is admin
 * - showMessage: Whether to show access denied message (default: true)
 * - fallback: Custom component to show instead of default message
 */
const AdminOnlyAccess = ({ 
  children, 
  showMessage = true, 
  fallback = null,
  style = {} 
}) => {
  const { user } = useAuth();

  // Check if user is admin
  const userIsAdmin = isAdmin(user);

  // If user is admin, show the content
  if (userIsAdmin) {
    return <View style={style}>{children}</View>;
  }

  // If user is not admin and we should show a message
  if (showMessage && !fallback) {
    return (
      <Card style={[{ margin: 16, padding: 16 }, style]}>
        <View style={{ alignItems: 'center', padding: 20 }}>
          <Icon source="shield-lock" size={48} color="#ff6b6b" />
          <Title style={{ marginTop: 16, textAlign: 'center' }}>
            Admin Access Required
          </Title>
          <Paragraph style={{ textAlign: 'center', marginTop: 8 }}>
            This feature is only available to administrators. 
            Please contact your system administrator for access.
          </Paragraph>
        </View>
      </Card>
    );
  }

  // If custom fallback is provided
  if (fallback) {
    return fallback;
  }

  // Otherwise, show nothing
  return null;
};

/**
 * AdminOnlyButton Component
 * 
 * A button that is only visible to admin users
 */
export const AdminOnlyButton = ({ children, ...props }) => {
  const { user } = useAuth();
  const userIsAdmin = isAdmin(user);

  if (!userIsAdmin) {
    return null;
  }

  return <Button {...props}>{children}</Button>;
};

/**
 * AdminModeToggle Component
 * 
 * A toggle component that shows admin status and allows role verification
 */
export const AdminModeToggle = ({ onToggle, style = {} }) => {
  const { user } = useAuth();
  const userIsAdmin = isAdmin(user);

  return (
    <Card style={[{ margin: 8, padding: 12 }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon 
            source={userIsAdmin ? "shield-check" : "shield-off"} 
            size={24} 
            color={userIsAdmin ? "#4caf50" : "#ff6b6b"} 
          />
          <View style={{ marginLeft: 12 }}>
            <Title style={{ fontSize: 16 }}>
              {userIsAdmin ? "Admin Mode" : "Donor Mode"}
            </Title>
            <Paragraph style={{ fontSize: 12, opacity: 0.7 }}>
              Role: {user?.role || 'Unknown'}
            </Paragraph>
          </View>
        </View>
        
        {userIsAdmin && onToggle && (
          <Button 
            mode="outlined" 
            compact 
            onPress={onToggle}
            style={{ marginLeft: 8 }}
          >
            Settings
          </Button>
        )}
      </View>
    </Card>
  );
};

/**
 * DonorOnlyAccess Component
 * 
 * This component wraps content that should only be visible to donor users.
 */
export const DonorOnlyAccess = ({ 
  children, 
  showMessage = true, 
  fallback = null,
  style = {} 
}) => {
  const { user } = useAuth();

  // Check if user is donor
  const userIsDonor = user?.role === 'DONOR' || user?.role === 'donor';

  // If user is donor, show the content
  if (userIsDonor) {
    return <View style={style}>{children}</View>;
  }

  // If user is not donor and we should show a message
  if (showMessage && !fallback) {
    return (
      <Card style={[{ margin: 16, padding: 16 }, style]}>
        <View style={{ alignItems: 'center', padding: 20 }}>
          <Icon source="account-heart" size={48} color="#ff6b6b" />
          <Title style={{ marginTop: 16, textAlign: 'center' }}>
            Donor Access Only
          </Title>
          <Paragraph style={{ textAlign: 'center', marginTop: 8 }}>
            This feature is only available to registered donors.
          </Paragraph>
        </View>
      </Card>
    );
  }

  // If custom fallback is provided
  if (fallback) {
    return fallback;
  }

  // Otherwise, show nothing
  return null;
};

/**
 * RoleBasedAccess Component
 * 
 * Generic component for role-based access control
 */
export const RoleBasedAccess = ({ 
  allowedRoles = [], 
  children, 
  showMessage = true, 
  fallback = null,
  style = {} 
}) => {
  const { user } = useAuth();

  // Check if user has required role
  const hasAccess = allowedRoles.includes(user?.role);

  // If user has access, show the content
  if (hasAccess) {
    return <View style={style}>{children}</View>;
  }

  // If user doesn't have access and we should show a message
  if (showMessage && !fallback) {
    return (
      <Card style={[{ margin: 16, padding: 16 }, style]}>
        <View style={{ alignItems: 'center', padding: 20 }}>
          <Icon source="lock" size={48} color="#ff6b6b" />
          <Title style={{ marginTop: 16, textAlign: 'center' }}>
            Access Restricted
          </Title>
          <Paragraph style={{ textAlign: 'center', marginTop: 8 }}>
            You don't have permission to access this feature.
            Required roles: {allowedRoles.join(', ')}
          </Paragraph>
        </View>
      </Card>
    );
  }

  // If custom fallback is provided
  if (fallback) {
    return fallback;
  }

  // Otherwise, show nothing
  return null;
};

export default AdminOnlyAccess;
