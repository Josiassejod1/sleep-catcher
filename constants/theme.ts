// theme.ts
export const theme = {
  colors: {
    primary: {
      midnightBlue: "#2C3E50",
      lavender: "#A29BFE",
      peach: "#FF9F68",
      sageGreen: "#6DC36D",
      offWhite: "#FAFAFA",
      deepNavy: "#1B1B2F"
    },
    text: {
      primary: "#2C3E50",
      secondary: "#6B7280",
      inverse: "#FFFFFF"
    },
    status: {
      success: "#6DC36D",
      warning: "#FFB347",
      error: "#E57373"
    }
  },
  typography: {
    fonts: {
      heading: "Poppins-SemiBold",
      body: "Inter-Regular",
      bodyBold: "Inter-Bold"
    },
    sizes: {
      h1: 28,
      h2: 22,
      h3: 18,
      body: 16,
      small: 14,
      caption: 12
    },
    lineHeights: {
      compact: 1.2,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  components: {
    card: {
      borderRadius: 24,
      shadow: true,
      padding: 16
    },
    button: {
      borderRadius: 20,
      paddingVertical: 12,
      paddingHorizontal: 24,
      fontSize: 16
    },
    slider: {
      trackColor: "#A29BFE",
      thumbColor: "#FF9F68"
    },
    chart: {
      moodLine: "#A29BFE",
      sleepLine: "#6DC36D",
      axisColor: "#2C3E50"
    }
  },
  iconography: {
    style: "rounded",
    examples: ["moon", "sunrise", "stars", "clouds"]
  },
  animations: {
    micro: {
      duration: 300,
      easing: "ease-in-out"
    },
    transitions: {
      fade: true,
      slide: true
    }
  },
  tone: {
    voice: "Warm, supportive, conversational",
    examples: {
      morning: "🌅 Good morning! Ready to log your sleep?",
      evening: "🌙 Time to wind down for the night.",
      insight: "✨ Looks like you sleep better when you log before 11pm."
    }
  }
};

export type Theme = typeof theme;
