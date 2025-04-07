import ObserveTriggers from '../../../../build/index.js';

/**
 * Determine the height of the admin bar if it is output.
 *
 * @type {number}
 */
const adminBarHeight = observeTriggersConfig.hasAdminBar
	? document.getElementById('wpadminbar')?.offsetHeight || 0
	: 0;

/**
 * Create the triggers instance with initial config.
 *
 * @type {ObserveTriggers}
 */
const triggers = new ObserveTriggers({
	offsetTop: adminBarHeight,
});

/**
 * Manage the ObserveTriggers offset when the window is resized
 * and the admin bar height has changed.
 */
window.addEventListener('resize', () => {
	const newHeight = observeTriggersConfig.hasAdminBar
		? document.getElementById('wpadminbar')?.offsetHeight || 0
		: 0;

	if (newHeight !== triggers.config.offsetTop) {
		const currentObservers = new Map(triggers.observers);

		// Update the current configuration.
		triggers.config.offsetTop = newHeight;

		// Disconnect all existing observers.
		triggers.destroy();

		// Reinitialize the triggers instance.
		triggers.init();

		/**
		 * Restore existing observers for the observer IDs skipped in the new
		 * init() process.
		 */
		currentObservers.forEach((observers, element) => {
			observers.forEach((observer, className) => {
				triggers.setupObserver(element, className);
			});
		});
	}
});
