<?php
/**
 * Plugin Name:  Observe Triggers
 * Description:  Enqueue the observe triggers library on your site.
 * Version:      1.0.0
 * Plugin URI:   https://github.com/happyprime/observe-triggers/
 * Author:       Happy Prime
 * Author URI:   https://happyprime.co
 * Text Domain:  observe-triggers
 * Requires PHP: 7.4
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * @package observe-triggers
 */

namespace ObserveTriggers;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_scripts' );
/**
 * Enqueue the Observe Triggers library.
 *
 * @see https://github.com/happyprime/observe-triggers/
 */
function enqueue_scripts(): void {
	wp_enqueue_script(
		'observe-triggers',
		plugins_url( 'js/build/observe-triggers.js', __FILE__ ),
		[],
		filemtime( plugin_dir_path( __FILE__ ) . 'js/build/observe-triggers.js' ),
		true
	);
}
