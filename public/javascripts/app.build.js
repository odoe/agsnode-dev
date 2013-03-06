/**
 * This is the build file I have started using
 * to build my ArcGIS JS API 3.0 apps, which are
 * based on Dojo 1.7. I used a similar build file
 * when I was using Require.js, so it wasn't much different.
 *
 * I tried using the Dojo Build Tools, but it just seemed
 * way too bloated to download the Dojo SDK, sort my files,
 * blah blah blah. With r.js I can use Node NPM to
 * npm install requirejs and just use the following command
 * r.js -o src/js/app.build.js
 * Done and done!
 *
 * This build file is meant to be used with r.js
 * http://requirejs.org/docs/optimization.html
 *
 * For more details on options, you can review
 * the sample r.js build file
 * https://github.com/jrburke/r.js/blob/master/build/example.build.js
 */
({
  appDir       : "../",
  baseUrl      : "js",
  dir          : "../../release",

  paths                  : {
    "text" : "empty: ",
    /**
    "jquery"             : 'libs/jquery/jquery-1.7.2.min',
    "jqueryui"           : 'libs/jqueryui/jquery-ui-1.8.20.custom.min',
     * This is key. Since the namespaces of dojo & esri,
     * even dojox and dijit come from the ArcGIS CDN, use the
     * empty: scheme so r.js doesn't try pull in these
     * dependencies.
     * http://requirejs.org/docs/optimization.html#empty
     */
    "dojo"  : "empty: ",
    "esri"  : "empty: ",
    "dijit" : "empty: "
  },
  /**
   * r.js uses uglifyjs by default.
   * https://github.com/mishoo/UglifyJS/
   *
   * If you run r.js via java, you can use google closure.
   * I tried to integrate closure, but java on my work
   * machine kept punching me in the face. Stick with uglify,
   * a dude on twitter told me it was faster anyway.
   */
  optimize : "uglify",
  /**
   * This doesn't work as intended for me.
   * According to docs and google groups, this
   * should remove all combined files when
   * optimizing a whole project
   */
  removeCombined      : true,
  /**
   * This option will grab all the text! calls and
   * place them in your optimized file to avoid
   * making XMLHttpRequests to load the files
   */
  inlineText          : true,

  /**
   * This is optional, as setting the modules
   * will create a combined file of all dependencies
   * in the release folder. You get a single larger file
   * to load rather than multiple smaller files.
   * Use at your own discretion.
   * */
  //modules  : [
    //{
      /**
       * I optimze my app file, because I use
       * my main file to set up my dojoConfig.
       * If doing a single js file optimization,
       * DO NOT include the dojoConfig file
       * to be included. It will blow you up.
       * Optmize the next entry point into your app.
       */
      //name: "main"
    //}
  //],

  /**
   * Will make your css a single line file
   */
  optimizeCss         : "standard",
  /**
   * Ewww, RegEx. It's easy though,
   * just include files/folders you don't want to
   * get exported to your release build folder.
   */
  fileExclusionRegExp : /\.(coffee|.*~|swp|rb|lnk)|sass|.sass-cache|build/
})
