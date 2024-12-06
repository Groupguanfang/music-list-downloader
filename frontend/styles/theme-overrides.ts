import { defineThemeOverrides } from '../utils/define'

export default defineThemeOverrides({
  Switch: {
    railColorActive: '#ff0000cc',
  },

  Select: {
    peers: {
      InternalSelection: {
      },
    },
  },
}, {}, {
  Select: {
    peers: {
      InternalSelectMenu: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
})
