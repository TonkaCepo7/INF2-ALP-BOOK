// src/plugins/vuetify.js
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme: {
        dark: false,
        colors: {
          background: '#E6F5EC', // mint pastel pozadina
          surface: '#ffffff',
          primary: '#2ecc71',   // intenzivna mint zelena
          secondary: '#27ae60',
          error: '#e74c3c',
          success: '#2ecc71',
        },
      },
    },
  },
  components,
  directives,
})

export default vuetify
