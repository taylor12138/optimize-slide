import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
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