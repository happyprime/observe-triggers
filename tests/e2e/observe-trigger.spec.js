import { test, expect } from '@playwright/test';

test.describe('Observe Trigger', () => {
	test('toggles class on intersection 20% from top of viewport', async ({
		page,
	}) => {
		await page.goto(
			'/tests/html/observe-trigger-20-top-toggle-example.html'
		);

		const box = page.locator('#test-box');

		// Initially, the class should not be present
		await expect(box).not.toContainClass('example');

		await page.evaluate(() => {
			// Calculate the height of the viewport and the position of the box and
			// then scroll so that the box is 20% from the top of the viewport.
			const viewportHeight = window.innerHeight;
			const boxPosition = document.getElementById('test-box').offsetTop;
			const scrollPosition = boxPosition - viewportHeight * 0.2 + 2;

			window.scrollTo(0, scrollPosition);
		});

		// Wait for the intersection observer to trigger
		await expect(box).toContainClass('example');

		// Scroll away (simulate leaving intersection)
		await page.evaluate(() => window.scrollTo(0, 0));
		await expect(box).not.toContainClass('example');
	});

	test('adds class on intersection 50% from top of viewport', async ({
		page,
	}) => {
		await page.goto('/tests/html/observe-trigger-50-top-add-example.html');

		const box = page.locator('#test-box');

		// Initially, the class should not be present
		await expect(box).not.toContainClass('example');

		await page.evaluate(() => {
			// Calculate the height of the viewport and the position of the box and
			// then scroll so that the box is 50% from the top of the viewport.
			const viewportHeight = window.innerHeight;
			const boxPosition = document.getElementById('test-box').offsetTop;
			const scrollPosition = boxPosition - viewportHeight * 0.5 + 2;

			window.scrollTo(0, scrollPosition);
		});

		// Wait for the intersection observer to trigger
		await expect(box).toContainClass('example');

		// Scroll away (simulate leaving intersection)
		await page.evaluate(() => window.scrollTo(0, 0));
		await expect(box).toContainClass('example');
	});

	test('removes class on intersection 30% from top of viewport', async ({
		page,
	}) => {
		await page.goto(
			'/tests/html/observe-trigger-30-top-remove-example.html'
		);

		const box = page.locator('#test-box');

		// Initially, the class should be present
		await expect(box).toContainClass('example');

		await page.evaluate(() => {
			// Calculate the height of the viewport and the position of the box and
			// then scroll so that the box is 30% from the top of the viewport.
			const viewportHeight = window.innerHeight;
			const boxPosition = document.getElementById('test-box').offsetTop;
			const scrollPosition = boxPosition - viewportHeight * 0.3 + 2;

			window.scrollTo(0, scrollPosition);
		});

		// Wait for the intersection observer to trigger
		await expect(box).not.toContainClass('example');

		// Scroll away (simulate leaving intersection)
		await page.evaluate(() => window.scrollTo(0, 0));
		await expect(box).not.toContainClass('example');
	});

	test('toggles class on intersection 20% from bottom of viewport', async ({
		page,
	}) => {
		await page.goto(
			'/tests/html/observe-trigger-20-bottom-toggle-example.html'
		);

		const box = page.locator('#test-box');

		// Initially, the class should not be present
		await expect(box).not.toContainClass('example');

		await page.evaluate(() => {
			// Calculate the height of the viewport and the position of the box and
			// then scroll so that the box is 30% from the top of the viewport.
			const viewportHeight = window.innerHeight;
			const boxPosition = document.getElementById('test-box').offsetTop;
			const scrollPosition = boxPosition - viewportHeight * 0.8 + 2;

			window.scrollTo(0, scrollPosition);
		});

		// Wait for the intersection observer to trigger
		await expect(box).toContainClass('example');

		// Scroll away (simulate leaving intersection)
		await page.evaluate(() => window.scrollTo(0, 0));
		await expect(box).not.toContainClass('example');
	});

	test('adds class on intersection 50% from bottom of viewport', async ({
		page,
	}) => {
		await page.goto(
			'/tests/html/observe-trigger-50-bottom-add-example.html'
		);

		const box = page.locator('#test-box');

		// Initially, the class should not be present
		await expect(box).not.toContainClass('example');

		await page.evaluate(() => {
			// Calculate the height of the viewport and the position of the box and
			// then scroll so that the box is 30% from the top of the viewport.
			const viewportHeight = window.innerHeight;
			const boxPosition = document.getElementById('test-box').offsetTop;
			const scrollPosition = boxPosition - viewportHeight * 0.5 + 2;

			window.scrollTo(0, scrollPosition);
		});

		// Wait for the intersection observer to trigger
		await expect(box).toContainClass('example');

		// Scroll away (simulate leaving intersection)
		await page.evaluate(() => window.scrollTo(0, 0));
		await expect(box).toContainClass('example');
	});

	test('removes class on intersection 30% from bottom of viewport', async ({
		page,
	}) => {
		await page.goto(
			'/tests/html/observe-trigger-30-bottom-remove-example.html'
		);

		const box = page.locator('#test-box');

		// Initially, the class should be present
		await expect(box).toContainClass('example');

		await page.evaluate(() => {
			// Calculate the height of the viewport and the position of the box and
			// then scroll so that the box is 30% from the top of the viewport.
			const viewportHeight = window.innerHeight;
			const boxPosition = document.getElementById('test-box').offsetTop;
			const scrollPosition = boxPosition - viewportHeight * 0.7 + 2;

			window.scrollTo(0, scrollPosition);
		});

		// Wait for the intersection observer to trigger
		await expect(box).not.toContainClass('example');

		// Scroll away (simulate leaving intersection)
		await page.evaluate(() => window.scrollTo(0, 0));
		await expect(box).not.toContainClass('example');
	});
});
