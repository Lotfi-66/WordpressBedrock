 /**
 * Compiler configuration
 *
 * @see {@link https://roots.io/sage/docs sage documentation}
 * @see {@link https://bud.js.org/learn/config bud.js configuration guide}
 *
 * @type {import('@roots/bud').Config}
 */
 export default async (app) => {
  // Configuration des entrées, du chemin public et des assets
  app
    .entry('app', ['@scripts/app', '@styles/app'])
    .entry('editor', ['@scripts/editor', '@styles/editor'])
    .assets(['images']);

  app.setPublicPath('/app/themes/sage/public/');

  app
    .setUrl('http://localhost:3000')
    .setProxyUrl('http://example.test')
    .watch(['resources/views', 'app']);

  app.wpjson
    .setSettings({
      background: {
        backgroundImage: true,
      },
      color: {
        custom: false,
        customDuotone: false,
        customGradient: false,
        defaultDuotone: false,
        defaultGradients: false,
        defaultPalette: false,
        duotone: [],
      },
      custom: {
        spacing: {},
        typography: {
          'font-size': {},
          'line-height': {},
        },
      },
      spacing: {
        padding: true,
        units: ['px', '%', 'em', 'rem', 'vw', 'vh'],
      },
      typography: {
        customFontSize: false,
      },
    })
    .useTailwindColors()
    .useTailwindFontFamily()
    .useTailwindFontSize();

  // Ajoute cette partie pour charger les fichiers GLSL
  app.build.rules.glsl = {
    test: /\.(glsl|vert|frag)$/,
    use: [
      {
        loader: 'raw-loader',
      },
    ],
  };
};
