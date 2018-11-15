import Typography from "typography"

const typography = new Typography({
  baseFontSize: "16px",
  includeNormalize: false,
  googleFonts: [
    {
      name: 'Lora',
      styles: [
        '400',
        '700',
      ],
    },
    {
      name: 'Karla',
      styles: [
        '400',
        '700',
      ],
    },
  ],
  headerFontFamily: [
    "Lora",
    "Avenir Next",
    "Helvetica Neue",
    "Segoe UI",
    "Helvetica",
    "Arial",
    "sans-serif"
  ],
  bodyFontFamily: [
    "Karla",
    "-apple-system",
    "BlinkMacSystemFont",
    "Georgia",
    "sans-serif"
  ]
});

export default typography
