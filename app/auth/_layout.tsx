import { Stack } from 'expo-router';
import { theme } from '@/constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary.offWhite,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontFamily: theme.typography.fonts.heading,
          fontSize: theme.typography.sizes.h3,
        },
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="sign-in" 
        options={{ 
          title: 'Sign In',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="sign-up" 
        options={{ 
          title: 'Create Account',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          title: 'Reset Password',
          headerShown: true,
          presentation: 'modal',
        }} 
      />
    </Stack>
  );
}
