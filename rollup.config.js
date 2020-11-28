import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

const getConfig = (entry) => ({
  input: `src/${entry}.js`,
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: `public/build/${entry}.js`,
  },
  plugins: [
    svelte({
			emitCss: false
      // // enable run-time checks when not in production
      // dev: !production,
      // // we'll extract any component CSS out into
      // // a separate file - better for performance
      // css: (css) => {
      //   css.write(`public/build/${entry}.css`);
      // },
    }),
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
		commonjs({ ignoreGlobal: true, exclude: []}),
    !production && serve(),
    !production && livereload("public"),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
});

const serve = (() => {
  let started = false;

  return () => ({
    writeBundle() {
      if (!started) {
        started = true;

        // require("child_process").spawn(
        //   "yarn",
        //   ["sirv", "public", "--dev", "--port", "3000"],
        //   {
        //     stdio: ["ignore", "inherit", "inherit"],
        //     shell: true,
        //   }
        // );
        require("child_process").spawn(
          "firebase",
          ["emulators:start"],
          {
            stdio: ["ignore", "inherit", "inherit"],
            shell: true,
          }
        );
      }
    },
  });
})();

export default ["gamemaster", "player"].map(getConfig);
