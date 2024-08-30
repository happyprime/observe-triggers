class ObserveTriggers {
	constructor(config = {}) {
		this.config = {
			baseTriggerClass: 'observe-trigger',
			baseTriggeredClass: 'observe-triggered',
			...config,
		};
		this.observers = new Map();
		this.elementStates = new WeakMap();
		this.init();
	}

	init() {
		this.observeElements();
		window.addEventListener('DOMContentLoaded', () =>
			this.observeElements()
		);
		window.addEventListener('load', () => this.observeElements());
	}

	/**
	 * Parse the class name for its configuration.
	 * @param {string} className
	 * @returns
	 */
	parseObserverClass(className) {
		// Remove the configured baseTriggerClass from the className.
		const parts = className
			.replace(this.config.baseTriggerClass + '-', '')
			.split('-');

		const config = {
			rootMargin: 0,
			threshold: 0,
			edge: 'top',
			action: 'toggle',
			class: 'observe-triggered',
			root: null,
		};

		let currentPart = 0;

		// Parse for a specified rootMargin, which is the first numeric value.
		if (!isNaN(parts[currentPart])) {
			config.rootMargin = parseInt(parts[currentPart]);
			currentPart++;
		}

		// Parse for a specified threshold, which is the second numeric value.
		if (!isNaN(parts[currentPart])) {
			config.threshold = parseInt(parts[currentPart]) / 100;
			currentPart++;
		}

		// Parse for a specified edge, if it exists.
		if (['top', 'bottom', 'left', 'right'].includes(parts[currentPart])) {
			config.edge = parts[currentPart];
			currentPart++;
		}

		// Parse for a specified action, if it exists.
		if (
			['toggle', 'add', 'remove', 'replace'].includes(parts[currentPart])
		) {
			config.action = parts[currentPart];
			currentPart++;
		}

		// Parse for a custom class and a root selector, if they exist.
		const remainingParts = parts.slice(currentPart);
		const rootIndex = remainingParts.findIndex(
			(part) => part.startsWith('#') || part.startsWith('.')
		);

		if (rootIndex !== -1) {
			config.class = remainingParts.slice(0, rootIndex).join('-');
			config.root = remainingParts.slice(rootIndex).join('-');
		} else {
			config.class = remainingParts.join('-') || config.class;
		}

		return config;
	}

	/**
	 * Find all elements with a class that starts with the baseTriggerClass
	 * and set up an IntersectionObserver for each one.
	 */
	observeElements() {
		document
			.querySelectorAll(`[class*="${this.config.baseTriggerClass}"]`)
			.forEach((element) => {
				const classes = Array.from(element.classList);
				classes.forEach((className) => {
					if (className.startsWith(this.config.baseTriggerClass)) {
						this.setupObserver(element, className);
					}
				});
			});
	}

	setupObserver(element, className) {
		const config = this.parseObserverClass(className);
		const rootMargin = 100 - parseInt(config.rootMargin);

		const options = {
			root: null,
			threshold: config.threshold,
		};

		if ('top' === config.edge) {
			options.rootMargin = '50% 0px -' + rootMargin + '% 0px';
		} else if ('bottom' === config.edge) {
			options.rootMargin = '-' + rootMargin + '% 0px 50% 0px';
		} else if ('left' === config.edge) {
			options.rootMargin = '0px -' + rootMargin + '% 0px 50%';
		} else if ('right' === config.edge) {
			options.rootMargin = '0px 50% 0px -' + rootMargin + '%';
		}

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				this.handleIntersection(element, entry, config, className);
			});
		}, options);

		observer.observe(element);

		if (!this.observers.has(element)) {
			this.observers.set(element, new Map());
		}
		this.observers.get(element).set(className, observer, false);
	}

	handleIntersection(element, entry, config, className) {
		const elementStates = this.elementStates.get(element) || new Map();

		// Determine if this element has previously triggered the observer.
		const hasTriggered = elementStates.get(className);

		// Determine if the element is currently considered triggered.
		const isTriggered = entry.intersectionRatio > config.threshold;

		/**
		 * If the element is currently intersecting, we want to trigger the
		 * observer. If the element has previously triggered the observer, we
		 * want to account for possible cases when the element is crossing out
		 * of its bounds and perform the action accordingly.
		 */
		if (entry.isIntersecting || hasTriggered) {
			switch (config.action) {
				case 'add':
					if (entry.isIntersecting && isTriggered) {
						element.classList.add(config.class);
					}
					break;
				case 'remove':
					if (entry.isIntersecting && isTriggered) {
						element.classList.remove(config.class);
					}
					break;
				case 'replace':
					// Remove all other class names that could be added based on other
					// class names that start with the baseTriggerClass by parsing them
					// with the parseObserverClass method.
					element.classList.forEach((otherClass) => {
						if (
							otherClass.startsWith(this.config.baseTriggerClass)
						) {
							const otherConfig =
								this.parseObserverClass(otherClass);
							if (otherConfig.class !== config.class) {
								element.classList.remove(otherConfig.class);
							}
						}
					});
					element.classList.add(config.class);
					break;
				case 'toggle':
				default:
					element.classList.toggle(config.class, isTriggered);
					break;
			}
		}

		// Add and remove are one-time actions, so we disconnect the observer.
		if (config.action.includes(['add', 'remove']) && isTriggered) {
			this.disconnectObserver(element, className);
		}

		// Track whether the element has ever triggered the observer.
		if (!hasTriggered && isTriggered) {
			elementStates.set(className, true);
		} else {
			elementStates.set(className, false);
		}

		this.elementStates.set(element, elementStates);
		this.dispatchEvent(element, isTriggered, config, className);
	}

	disconnectObserver(element, className) {
		const observers = this.observers.get(element);
		if (observers && observers.has(className)) {
			observers.get(className).disconnect();
			observers.delete(className);
			if (observers.size === 0) {
				this.observers.delete(element);
			}
		}
	}

	dispatchEvent(element, isIntersecting, config, className) {
		const event = new CustomEvent('observerTriggered', {
			detail: { element, isIntersecting, config, className },
		});
		window.dispatchEvent(event);
	}

	destroy() {
		this.observers.forEach((observers, element) => {
			observers.forEach((observer) => observer.disconnect());
		});
		this.observers.clear();
		this.elementStates.clear();
	}
}

export default ObserveTriggers;
