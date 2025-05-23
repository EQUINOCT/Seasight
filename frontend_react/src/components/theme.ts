import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#18181b', // Background color or primary color for your widgets
    },
    secondary: {
      main: '#e0e0e0', // Secondary color if needed
    },
    background: {
      default: '#18181b', // Default background for cards or containers
    },
    text: {
      primary: '#ffffff', // White text by default
    },
  },
  typography: {
    fontFamily: 'Inter',
    h5: {
      fontWeight: 400, // Customize heading style
    },
    body1: {
      fontSize: '1rem', // Customize the base body font
    },
  },
  components: {
    MuiGrid: {
      styleOverrides: {
        container: {
          gap : '15px',
        },
       },
      },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#18181b', // default background
          opacity: '98%',
          border: '0.1px solid rgba(255, 255, 255, 0.3)',
          color: '#ffffff', // default text color
          fontFamily: 'Inter',
          borderRadius: '15px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          opacity: '95%',
          border: '0.1px solid rgba(255, 255, 255, 0.3)',
          color: '#18181B', // default text color
          fontFamily: 'Inter',
          borderRadius: '20px',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // padding: '4px',
          maxWidth: 100,
          width: '100%',
          // backgroundColor: '#488DA3', 
          color: '#ffffff', // default text color
          fontFamily: 'Inter',
          fontWeight: 250,
          fontSize: '14px',
          borderRadius: '25px',
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          backgroundColor: '#18181b', // default background
          opacity: '95%',
          padding: '4px 8px',
          color: '#ffffff', // default text color
          fontFamily: 'Inter',
          borderRadius: '5px',
          '& .MuiBreadCrumb-ol':{
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          opacity: '95%',
          // padding: '4px 8px',
          borderRadius: '10px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#488DA3', // Set the label color
          fontWeight: '300',
          opacity: 0.85,
          marginTop: 3,
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter',
          borderRadius: '10px',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: '#488DA3', // Input text color
          fontFamily: 'Inter',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: '#488DA3',
          opacity: '75%',
        },
        root: {
          height:'30px',
          fontFamily: 'Inter',
          fontSize: '14px',
          '& .MuiSelect-select': {
            padding: '0 14px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none', // Remove the default outline
         },
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          height: '30px', // Set the height of each dropdown option globally
          '&:hover': {
            // color: '#000',
            backgroundColor: '#00738c', // Change background color on hover
            opacity: 0.8, // Reduce opacity on hover
          },
        },
      },
    },
  },
  spacing: 8, // Default spacing unit if needed
});

export default theme;
