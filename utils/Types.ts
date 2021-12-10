export interface WeatherData {
    current: {
      main: {
        temp: number
      },
      weather: Array<{
        main: Object,
        icon: string
      }>
    },
    forecast: {
      list: Array<{
        main: {
          dt: number,
          main: Object,
          weather: Array<{
            main: Object,
            icon: string
          }>
        }
      }>
    }
  }