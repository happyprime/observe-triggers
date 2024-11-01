import resolve from '@rollup/plugin-node-resolve';

export default {
	input: 'integrations/wordpress/js/src/observe-triggers.js',
	output: {
		file: 'integrations/wordpress/js/build/observe-triggers.js',
		format: 'iife', // Immediately Invoked Function Expression, suitable for <script> tags
		name: 'ObserveTriggersBundle',
	},
	plugins: [resolve()],
};
