import { MD3LightTheme } from 'react-native-paper';

// NGO Red and White Theme Configuration
export const ngoTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary colors (Red theme)
    primary: '#C62828',
    primaryContainer: '#FFCDD2',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#C62828',
    
    // Secondary colors (Light red/pink)
    secondary: '#FFCDD2',
    secondaryContainer: '#FFE8E8',
    onSecondary: '#C62828',
    onSecondaryContainer: '#8E0000',
    
    // Surface colors
    surface: '#FFFFFF',
    surfaceVariant: '#FFF5F5',
    onSurface: '#2C2C2C',
    onSurfaceVariant: '#666666',
    
    // Background colors
    background: '#FAFAFA',
    onBackground: '#2C2C2C',
    
    // Error colors (keeping red theme consistent)
    error: '#D32F2F',
    errorContainer: '#FFEBEE',
    onError: '#FFFFFF',
    onErrorContainer: '#B71C1C',
    
    // Outline colors
    outline: '#E0E0E0',
    outlineVariant: '#F5F5F5',
    
    // Inverse colors
    inverseSurface: '#2C2C2C',
    inverseOnSurface: '#FFFFFF',
    inversePrimary: '#FFCDD2',
    
    // Shadow and elevation
    shadow: '#000000',
    scrim: '#000000',
    
    // Custom NGO colors
    success: '#4CAF50',
    warning: '#FF9800',
    info: '#2196F3',
    
    // Blood type colors
    bloodTypeA: '#E57373',
    bloodTypeB: '#F06292',
    bloodTypeAB: '#BA68C8',
    bloodTypeO: '#FF8A65',
    
    // Status colors
    available: '#4CAF50',
    unavailable: '#F44336',
    pending: '#FF9800',
    
    // Card backgrounds
    cardBackground: '#FFFFFF',
    cardElevated: '#FFFFFF',
    
    // Button variants
    buttonPrimary: '#C62828',
    buttonSecondary: '#FFCDD2',
    buttonOutline: '#C62828',
    buttonText: '#C62828',
  },
  
  // Custom spacing and dimensions
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border radius
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 24,
  },
  
  // Typography customization
  fonts: {
    ...MD3LightTheme.fonts,
    headlineLarge: {
      ...MD3LightTheme.fonts.headlineLarge,
      color: '#C62828',
      fontWeight: 'bold',
    },
    headlineMedium: {
      ...MD3LightTheme.fonts.headlineMedium,
      color: '#C62828',
      fontWeight: '600',
    },
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      color: '#2C2C2C',
      fontWeight: '600',
    },
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      color: '#2C2C2C',
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      color: '#666666',
    },
  },
  
  // Elevation and shadows
  elevation: {
    level0: 0,
    level1: 1,
    level2: 2,
    level3: 4,
    level4: 6,
    level5: 8,
  },
};

// Common styles for consistent spacing and layout
export const commonStyles = {
  // Container styles
  container: {
    flex: 1,
    backgroundColor: ngoTheme.colors.background,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: ngoTheme.colors.background,
  },
  
  content: {
    flex: 1,
    padding: ngoTheme.spacing.md,
  },
  
  contentWithHeader: {
    flex: 1,
    paddingHorizontal: ngoTheme.spacing.md,
    paddingTop: ngoTheme.spacing.sm,
    paddingBottom: ngoTheme.spacing.md,
  },
  
  // Header styles
  header: {
    backgroundColor: ngoTheme.colors.surface,
    elevation: ngoTheme.elevation.level2,
    paddingHorizontal: ngoTheme.spacing.md,
    paddingVertical: ngoTheme.spacing.sm,
  },
  
  headerTitle: {
    color: ngoTheme.colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Card styles
  card: {
    backgroundColor: ngoTheme.colors.cardBackground,
    borderRadius: ngoTheme.borderRadius.medium,
    marginBottom: ngoTheme.spacing.md,
    elevation: ngoTheme.elevation.level1,
  },
  
  cardContent: {
    padding: ngoTheme.spacing.md,
  },
  
  // Button styles
  primaryButton: {
    backgroundColor: ngoTheme.colors.primary,
    borderRadius: ngoTheme.borderRadius.medium,
    marginVertical: ngoTheme.spacing.sm,
  },
  
  secondaryButton: {
    backgroundColor: ngoTheme.colors.secondary,
    borderRadius: ngoTheme.borderRadius.medium,
    marginVertical: ngoTheme.spacing.sm,
  },
  
  outlineButton: {
    borderColor: ngoTheme.colors.primary,
    borderWidth: 2,
    borderRadius: ngoTheme.borderRadius.medium,
    marginVertical: ngoTheme.spacing.sm,
  },
  
  buttonContent: {
    paddingVertical: ngoTheme.spacing.sm,
  },
  
  // Input styles
  textInput: {
    backgroundColor: ngoTheme.colors.surface,
    marginBottom: ngoTheme.spacing.md,
  },
  
  // Spacing utilities
  marginTop: {
    sm: { marginTop: ngoTheme.spacing.sm },
    md: { marginTop: ngoTheme.spacing.md },
    lg: { marginTop: ngoTheme.spacing.lg },
    xl: { marginTop: ngoTheme.spacing.xl },
  },
  
  marginBottom: {
    sm: { marginBottom: ngoTheme.spacing.sm },
    md: { marginBottom: ngoTheme.spacing.md },
    lg: { marginBottom: ngoTheme.spacing.lg },
    xl: { marginBottom: ngoTheme.spacing.xl },
  },
  
  padding: {
    sm: { padding: ngoTheme.spacing.sm },
    md: { padding: ngoTheme.spacing.md },
    lg: { padding: ngoTheme.spacing.lg },
    xl: { padding: ngoTheme.spacing.xl },
  },
  
  paddingHorizontal: {
    sm: { paddingHorizontal: ngoTheme.spacing.sm },
    md: { paddingHorizontal: ngoTheme.spacing.md },
    lg: { paddingHorizontal: ngoTheme.spacing.lg },
    xl: { paddingHorizontal: ngoTheme.spacing.xl },
  },
  
  paddingVertical: {
    sm: { paddingVertical: ngoTheme.spacing.sm },
    md: { paddingVertical: ngoTheme.spacing.md },
    lg: { paddingVertical: ngoTheme.spacing.lg },
    xl: { paddingVertical: ngoTheme.spacing.xl },
  },
};

export default ngoTheme;
