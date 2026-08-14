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
    ],
    error: [
      "#ffe8e9",
      "#ffd1d1",
      "#fba0a0",
      "#f76d6d",
      "#f44141",
      "#f22625",
      "#f21616",
      "#d8070b",
      "#c10007",
      "#a90003"
    ],
    success: [
      "#e6ffee",
      "#d3f9e0",
      "#a8f2c0",
      "#7aea9f",
      "#54e382",
      "#3bdf70",
      "#2bdd66",
      "#1bc455",
      "#0bae4a",
      "#00973c"
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