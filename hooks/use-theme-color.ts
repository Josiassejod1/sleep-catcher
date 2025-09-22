/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { theme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string
) {
  const colorScheme = useColorScheme() ?? 'light';
  const colorFromProps = props[colorScheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Return a default color from our theme
    return colorScheme === 'dark' 
      ? theme.colors.text.inverse 
      : theme.colors.text.primary;
  }
}
