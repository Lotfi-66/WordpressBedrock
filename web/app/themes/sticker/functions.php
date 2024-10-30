<?php

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader for
| our theme. We will simply require it into the script here so that we
| don't have to worry about manually loading any of our classes later on.
|
*/

if (! file_exists($composer = __DIR__ . '/vendor/autoload.php')) {
    wp_die(__('Error locating autoloader. Please run <code>composer install</code>.', 'sage'));
}

require $composer;

/*
|--------------------------------------------------------------------------
| Register The Bootloader
|--------------------------------------------------------------------------
|
| The first thing we will do is schedule a new Acorn application container
| to boot when WordPress is finished loading the theme. The application
| serves as the "glue" for all the components of Laravel and is
| the IoC container for the system binding all of the various parts.
|
*/

if (! function_exists('\Roots\bootloader')) {
    wp_die(
        __('You need to install Acorn to use this theme.', 'sage'),
        '',
        [
            'link_url' => 'https://roots.io/acorn/docs/installation/',
            'link_text' => __('Acorn Docs: Installation', 'sage'),
        ]
    );
}

\Roots\bootloader()->boot();

/*
|--------------------------------------------------------------------------
| Register Sage Theme Files
|--------------------------------------------------------------------------
|
| Out of the box, Sage ships with categorically named theme files
| containing common functionality and setup to be bootstrapped with your
| theme. Simply add (or remove) files from the array below to change what
| is registered alongside Sage.
|
*/

collect(['setup', 'filters'])
    ->each(function ($file) {
        if (! locate_template($file = "app/{$file}.php", true, true)) {
            wp_die(
                /* translators: %s is replaced with the relative file path */
                sprintf(__('Error locating <code>%s</code> for inclusion.', 'sage'), $file)
            );
        }
    });

add_filter('show_admin_bar', '__return_false');

// Tout ce que j'ai ajouter a partir d'ici 
function start_session() {
    if (!session_id()) {
        session_start();
    }
}
add_action('init', 'start_session', 1);

// Fonction AJAX pour vérifier le code de déverrouillage
add_action('wp_ajax_check_unlock_code', 'check_unlock_code_ajax');
add_action('wp_ajax_nopriv_check_unlock_code', 'check_unlock_code_ajax');

function check_unlock_code_ajax() {
    @ini_set('display_errors', 0);

    $code = isset($_POST['code']) ? sanitize_text_field($_POST['code']) : '';

    if (empty($code)) {
        wp_send_json_error(array('message' => 'Code manquant'));
        return;
    }

    $args = array(
        'post_type' => 'sticker',
        'meta_query' => array(
            array(
                'key' => 'Code_de_deverouillage',
                'value' => $code,
                'compare' => '='
            )
        ),
        'posts_per_page' => 1
    );

    $query = new WP_Query($args);

    if ($query->have_posts()) {
        $query->the_post();
        $sticker_id = get_the_ID();

        // Stocker l'ID du sticker dans la session pour identifier qu'il est déverrouillé
        $_SESSION['unlocked_' . $sticker_id] = true;

        wp_send_json_success(array('sticker_id' => $sticker_id));
    } else {
        wp_send_json_error(array('message' => 'Code invalide'));
    }

    wp_die();
}
