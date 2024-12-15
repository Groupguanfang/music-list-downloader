import { defineThemeOverrides } from '../utils/define'

export default defineThemeOverrides({
  common: {
    borderRadius: '0.5rem',
  },

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

  Message: {
    colorSuccess: '#9fa2006b',
    colorError: '#ff00006b',
    colorWarning: '#00ffd64f',
    colorInfo: '#00a2ff6b',
    boxShadowSuccess: 'none',
    boxShadowError: 'none',
    boxShadowWarning: 'none',
    boxShadowInfo: 'none',
  },
})