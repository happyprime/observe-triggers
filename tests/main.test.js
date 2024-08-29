import ObserveTriggers from '../src';

describe('ObserveTriggers', () => {
	let triggers;

	beforeEach(() => {
		// Clear all instances and calls to constructor and all methods:
		jest.clearAllMocks();

		// Mock IntersectionObserver
		global.IntersectionObserver = jest.fn(() => ({
			observe: jest.fn(),
			unobserve: jest.fn(),
			disconnect: jest.fn(),
		}));

		// Mock window methods
		window.addEventListener = jest.fn();

		triggers = new ObserveTriggers();
	});

	test('constructor initializes with default config', () => {
		expect(triggers.config).toEqual({
			baseTriggerClass: 'observe-trigger',
			baseTriggeredClass: 'observe-triggered',
		});
	});

	test('init method sets up event listeners', () => {
		expect(window.addEventListener).toHaveBeenCalledTimes(2);
		expect(window.addEventListener).toHaveBeenCalledWith(
			'DOMContentLoaded',
			expect.any(Function)
		);
		expect(window.addEventListener).toHaveBeenCalledWith(
			'load',
			expect.any(Function)
		);
	});

	test('parseObserverClass parses root margin', () => {
		const result = triggers.parseObserverClass('observe-trigger-10');
		expect(result).toEqual({
			rootMargin: 10,
			threshold: 0,
			edge: 'top',
			action: 'toggle',
			class: 'observe-triggered',
			root: null,
		});
	});

	test('parseObserverClass parses root margin and threshold', () => {
		const result = triggers.parseObserverClass('observe-trigger-10-40');

		expect(result).toEqual({
			rootMargin: 10,
			threshold: 0.4,
			edge: 'top',
			action: 'toggle',
			class: 'observe-triggered',
			root: null,
		});
	});

	test('parseObserverClass parses root margin, threshold, and edge', () => {
		const result = triggers.parseObserverClass(
			'observe-trigger-10-40-bottom'
		);

		expect(result).toEqual({
			rootMargin: 10,
			threshold: 0.4,
			edge: 'bottom',
			action: 'toggle',
			class: 'observe-triggered',
			root: null,
		});
	});

	test('parseObserverClass parses root margin, threshold, edge, and action', () => {
		const result = triggers.parseObserverClass(
			'observe-trigger-10-40-bottom-add'
		);

		expect(result).toEqual({
			rootMargin: 10,
			threshold: 0.4,
			edge: 'bottom',
			action: 'add',
			class: 'observe-triggered',
			root: null,
		});
	});

	test('parseObserverClass parses root margin, threshold, edge, action, and class', () => {
		const result = triggers.parseObserverClass(
			'observe-trigger-10-40-bottom-add-active'
		);

		expect(result).toEqual({
			rootMargin: 10,
			threshold: 0.4,
			edge: 'bottom',
			action: 'add',
			class: 'active',
			root: null,
		});
	});

	test('parseObserverClass parses root margin, threshold, edge, action, class, and ID root', () => {
		const result = triggers.parseObserverClass(
			'observe-trigger-10-40-top-toggle-smooth-bounce-#test-element'
		);

		expect(result).toEqual({
			rootMargin: 10,
			threshold: 0.4,
			edge: 'top',
			action: 'toggle',
			class: 'smooth-bounce',
			root: '#test-element',
		});
	});

	test('parseObserverClass parses root margin, threshold, edge, action, class, and class root', () => {
		const result = triggers.parseObserverClass(
			'observe-trigger-10-40-top-toggle-smooth-bounce-.test-element'
		);

		expect(result).toEqual({
			rootMargin: 10,
			threshold: 0.4,
			edge: 'top',
			action: 'toggle',
			class: 'smooth-bounce',
			root: '.test-element',
		});
	});

	test('parseObserverClass parses action without edge', () => {
		const result = triggers.parseObserverClass(
			'observe-trigger-10-40-toggle'
		);

		expect(result).toEqual({
			rootMargin: 10,
			threshold: 0.4,
			edge: 'top',
			action: 'toggle',
			class: 'observe-triggered',
			root: null,
		});
	});

	test('parseObserverClass parses action without threshold and edge', () => {
		const result = triggers.parseObserverClass('observe-trigger-10-remove');

		expect(result).toEqual({
			rootMargin: 10,
			threshold: 0,
			edge: 'top',
			action: 'remove',
			class: 'observe-triggered',
			root: null,
		});
	});
});
