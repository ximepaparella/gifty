import { ThemeConfig } from 'antd'

const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#7367F0',
    colorLink: '#7367F0',
    borderRadius: 6,
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Button: {
      controlHeight: 40,
      fontWeight: 500,
    },
    Card: {
      boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.06)',
    },
    Form: {
      marginLG: 24,
    },
  },
}

export default antdTheme 