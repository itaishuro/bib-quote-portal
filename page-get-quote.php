<?php
/* Template Name: Get Quote */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Get Quote</title>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<div class="chat-container">
    <div class="chat-header">
        <div class="avatar-wrapper">
            <img src="<?php echo get_template_directory_uri(); ?>/assets/images/itai.png" alt="Itai from Bright" class="avatar-image">
        </div>
        <span>Itai from Bright</span>
        <button class="close-button">&times;</button>
    </div>

    <div class="main-content-area" id="mainContentArea"></div>

        <div class="legal-notice" style="padding: 1rem; background-color: #f9f9f9; border-top: 1px solid #ddd; font-size: 0.95rem;">
            <strong>S.I 81 OF 2023</strong><br>
            Statutory Instrument (SI) 81 of 2023 which introduces the  <strong>“No Premium No Cover” position by local insurers, applicable to all classes of insurance, except Crop insurance</strong>
        </div>
</div>

<?php wp_footer(); ?>
</body>
</html>
