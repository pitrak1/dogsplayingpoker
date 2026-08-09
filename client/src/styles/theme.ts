import { createTheme } from "@mantine/core";

export const theme = createTheme({
  colors: {
    brand: [
      "#ecefff",
      "#d5dafb",
      "#a9b1f1",
      "#7a87e9",
      "#5362e1",
      "#3a4bdd",
      "#2c40dc",
      "#1f32c4",
      "#182cb0",
      "#0a259c"
    ]
  },
  primaryColor: 'brand',
  primaryShade: 5,
  components: {
    Button: {
      defaultProps: { color: 'brand' },
    },
  },
})