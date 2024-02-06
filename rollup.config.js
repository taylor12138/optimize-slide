import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss'
import babel from '@rollup/plugin-babel';

export default [
	{
		input: 'src/main.tsx',
		output: [
            {
              dir: 'dist',
              format: 'es',
              entryFileNames: () => `[name].mjs`
            },
            {
              dir: 'dist',
              format: 'cjs',
              exports: 'named',
              entryFileNames: () => `[name].cjs`
            }
        ],
		plugins: [
            typescript({
                tsconfig: './tsconfig.json'
            }),
            postcss(),
            babel({
                babelHelpers: 'bundled', 
                extensions: ['.ts', '.tsx'] 
            }),
			resolve(),
			commonjs(),
		],
        external: ['react']
	}
];