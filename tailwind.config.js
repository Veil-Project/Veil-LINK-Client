module.exports = {
  theme: {
    extend: {
      screens: {
        dark: { raw: '(prefers-color-scheme: dark)' },
      },
      spacing: {
        '2px': '2px',
        '9': '2.25rem',
        titlebar: '12px',
        '-titlebar': '-12px',
      },
      height: {
        titlebar: '36px',
      },
      colors: {
        gray: {
          100: '#EBECED',
          200: '#CED0D2',
          300: '#B1B3B7',
          400: '#767B80',
          500: '#444a51',
          600: '#353B43',
          700: '#23282C',
          800: '#1B1E21',
          900: '#121416',
        },
        blue: {
          100: '#E7EFFD',
          200: '#C3D6FB',
          300: '#99CCFF',
          400: '#3d8eff',
          500: '#0F5AEF',
          600: '#0E51D7',
          700: '#09368F',
          800: '#07296C',
          900: '#051B48',
        },
        teal: {
          100: '#F2FFFF',
          200: '#E0FEFF',
          300: '#CDFEFE',
          400: '#A7FDFE',
          500: '#81FCFD',
          600: '#74E3E4',
          700: '#4D9798',
          800: '#3A7172',
          900: '#274C4C',
        },
      },
      linearGradients: theme => ({
        directions: {
          r: 'to right',
        },
        colors: {
          blue: [theme('colors.blue.400'), theme('colors.blue.500')],
        },
      }),
      inset: theme => ({
        ...theme.inset,
        '1/2': '50%',
      }),
    },
    animations: {
      spin: {
        from: {
          transform: 'rotate(0deg)',
        },
        to: {
          transform: 'rotate(360deg)',
        },
      },
    },
    textStyles: theme => ({
      // defaults to {}
      heading: {
        output: false, // this means there won't be a "heading" component in the CSS, but it can be extended
        fontWeight: theme('fontWeight.bold'),
        lineHeight: theme('lineHeight.tight'),
      },
      h1: {
        extends: 'heading', // this means all the styles in "heading" will be copied here; "extends" can also be an array to extend multiple text styles
        fontSize: theme('fontSize.5xl'),
        '@screen sm': {
          fontSize: theme('fontSize.6xl'),
        },
      },
      h2: {
        extends: 'heading',
        fontSize: theme('fontSize.4xl'),
        '@screen sm': {
          fontSize: theme('fontSize.5xl'),
        },
      },
      h3: {
        extends: 'heading',
        fontSize: theme('fontSize.4xl'),
      },
      h4: {
        extends: 'heading',
        fontSize: theme('fontSize.3xl'),
      },
      h5: {
        extends: 'heading',
        fontSize: theme('fontSize.2xl'),
      },
      h6: {
        extends: 'heading',
        fontSize: theme('fontSize.xl'),
      },
      link: {
        fontWeight: theme('fontWeight.bold'),
        color: theme('colors.blue.400'),
        '&:hover': {
          color: theme('colors.blue.600'),
          textDecoration: 'underline',
        },
      },
      richText: {
        fontWeight: theme('fontWeight.normal'),
        fontSize: theme('fontSize.base'),
        lineHeight: theme('lineHeight.relaxed'),
        '> * + *': {
          marginTop: '1em',
        },
        h1: {
          extends: 'h1',
        },
        h2: {
          extends: 'h2',
        },
        h3: {
          extends: 'h3',
        },
        h4: {
          extends: 'h4',
        },
        h5: {
          extends: 'h5',
        },
        h6: {
          extends: 'h6',
        },
        ul: {
          listStyleType: 'disc',
          marginLeft: '1em',
        },
        ol: {
          listStyleType: 'decimal',
          marginLeft: '1em',
        },
        a: {
          extends: 'link',
        },
        'b, strong': {
          fontWeight: theme('fontWeight.bold'),
        },
        'i, em': {
          fontStyle: 'italic',
        },
      },
    }),
  },
  variants: {},
  plugins: [
    require('tailwindcss-gradients')(),
    require('tailwindcss-font-variant-numeric'),
    require('tailwindcss-animations'),
    require('tailwindcss-typography')(),
    function({ addUtilities }) {
      addUtilities({
        '.draggable': {
          '-webkit-app-region': 'drag',
        },
      })
    },
  ],
}
