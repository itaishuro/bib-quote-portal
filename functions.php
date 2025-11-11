<?php

// add this  code at the bottom of the functions.php file 
/var/www/html/bib/wp-content/themes/bib/functions.php

function bright_chatbot_shortcode() {
    ob_start();
    ?>
    <div class="chat-container">
        <div class="chat-header">
            <div class="avatar-wrapper">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/images/itai.png" alt="Itai from Bright" class="avatar-image">
            </div>
            <span>Itai from Bright</span>
            <button class="close-button">&times;</button>
        </div>
        <div class="main-content-area" id="mainContentArea"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('bright_chatbot', 'bright_chatbot_shortcode');

function enqueue_bright_chatbot_assets() {
    if (is_page('get-quote')) {
        wp_enqueue_style('chatbot-style', get_template_directory_uri() . '/css/calculator.css', [], '1.0');
        wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
        wp_enqueue_script('pdfmake', 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js', [], null, true);
        wp_enqueue_script('pdfmake-vfs', 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js', [], null, true);
        wp_enqueue_script('calculator', get_template_directory_uri() . '/js/calculator.js', ['pdfmake', 'pdfmake-vfs'], '1.0', true);
        wp_localize_script('calculator', 'bib_data', [
            'themeUrl'   => get_template_directory_uri(),
            'ajax_url'   => admin_url('admin-ajax.php'),
            'ajax_nonce' => wp_create_nonce('quote_email_nonce'),
            'bibhome'    => esc_url(home_url('/'))
        ]);
    }
}
add_action('wp_enqueue_scripts', 'enqueue_bright_chatbot_assets');

// API code 
add_action('rest_api_init', function () {
    register_rest_route('bib/v1', '/cars', [
        'methods' => 'GET',
        'callback' => 'bib_get_car_data',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('bib/v1', '/save-quote', [
        'methods' => 'POST',
        'callback' => 'bib_save_quote',
        'permission_callback' => '__return_true',
    ]);
});

// GET car data
function bib_get_car_data() {
    $custom_db = new wpdb('root', 'Aywhvoudf9&E', 'bib_dbchat', 'localhost');
    $results = $custom_db->get_results("SELECT * FROM bib_calculator_cars", ARRAY_A);
    return rest_ensure_response($results);
}

// POST quote
function bib_save_quote($request) {
    $custom_db = new wpdb('root', 'Aywhvoudf9&E', 'bib_dbchat', 'localhost');
    $data = $request->get_json_params();

    $insert = $custom_db->insert('bib_calculator_quotes', [
        'first_name'      => sanitize_text_field($data['first_name'] ?? ''),
        'surname'         => sanitize_text_field($data['surname'] ?? ''),
        'email'           => sanitize_email($data['email'] ?? ''),
        'phone_number'    => sanitize_text_field($data['phone_number'] ?? ''),
        'insurance_type'  => sanitize_text_field($data['insurance_type'] ?? ''),
        'annual_premium'  => floatval($data['annual_premium'] ?? 0),
        'term_premium'    => floatval($data['term_premium'] ?? 0),
        'vehicle_registration' => sanitize_text_field($data['vehicle_registration'] ?? ''),
        'details'         => sanitize_textarea_field($data['details'] ?? ''),
        'created_at'      => current_time('mysql', 1),
    ]);

    if ($insert) {
        return rest_ensure_response(['success' => true]);
    } else {
        return new WP_Error('db_insert_error', 'Failed to save quote.', ['status' => 500]);
    }
}

// Email handlers
add_action('wp_ajax_send_quote_email', 'send_quote_email');
add_action('wp_ajax_nopriv_send_quote_email', 'send_quote_email');

function send_quote_email() {
    try {
        $form_data_raw = $_POST['form_data'] ?? null;

        if (!$form_data_raw) {
            throw new Exception('Missing form data');
        }

        $form_data = json_decode(stripslashes($form_data_raw), true);

        if (!is_array($form_data)) {
            throw new Exception('Invalid form data');
        }

        $name = sanitize_text_field($form_data['firstName'] ?? '');
        $surname = sanitize_text_field($form_data['surname'] ?? '');
        $customer_email = sanitize_email($form_data['email'] ?? '');
        $phone = sanitize_text_field($form_data['phoneNumber'] ?? '');
        $currentFlow = sanitize_text_field($_POST['currentFlow'] ?? '');
        
        // Determine quote type from flow
        $quoteType = 'Insurance Quote';
        if ($currentFlow === 'carInsurance') $quoteType = 'Car Insurance';
        elseif ($currentFlow === 'homeInsurance') $quoteType = 'Home Insurance';
        elseif ($currentFlow === 'houseAndContentsInsurance') $quoteType = 'House & Contents Insurance';
        elseif ($currentFlow === 'houseContentsInsurance') $quoteType = 'House Contents Insurance';

        // Sanitize term values
        $termLabel = sanitize_text_field($_POST['termLabel'] ?? '');
        $termQuoteRaw = sanitize_text_field($_POST['termQuote'] ?? '');
        $finalQuoteRaw = sanitize_text_field($_POST['finalQuote'] ?? '');

        $termQuote = number_format(floatval($termQuoteRaw), 2, '.', ',');
        $finalQuote = number_format(floatval($finalQuoteRaw), 2, '.', ',');

        // 1. Send email to BRIGHT TEAM (internal)
        $team_message = '<h2>New Insurance Quote Request</h2>';
        $team_message .= '<p><strong>Customer Details:</strong></p>';
        $team_message .= '<table cellspacing="0" cellpadding="6" border="1" style="border-collapse: collapse; width: 100%;">';
        $team_message .= "<tr><th align='left' style='padding: 8px;'>Name</th><td style='padding: 8px;'>{$name} {$surname}</td></tr>";
        $team_message .= "<tr><th align='left' style='padding: 8px;'>Email</th><td style='padding: 8px;'>{$customer_email}</td></tr>";
        $team_message .= "<tr><th align='left' style='padding: 8px;'>Phone</th><td style='padding: 8px;'>{$phone}</td></tr>";
        $team_message .= "<tr><th align='left' style='padding: 8px;'>Insurance Type</th><td style='padding: 8px;'>{$quoteType}</td></tr>";
        
        // Add specific form data
        foreach ($form_data as $key => $value) {
            if (!in_array($key, ['firstName', 'surname', 'email', 'phoneNumber'])) {
                $key_label = ucwords(str_replace(['_', '-'], ' ', $key));
                $team_message .= "<tr><th align='left' style='padding: 8px;'>{$key_label}</th><td style='padding: 8px;'>{$value}</td></tr>";
            }
        }
        
        $team_message .= "<tr><th align='left' style='padding: 8px;'>Term</th><td style='padding: 8px;'>{$termLabel}</td></tr>";
        $team_message .= "<tr><th align='left' style='padding: 8px;'>Term Premium (US$)</th><td style='padding: 8px;'>{$termQuote}</td></tr>";
        $team_message .= "<tr><th align='left' style='padding: 8px;'>Annual Premium (US$)</th><td style='padding: 8px;'>{$finalQuote}</td></tr>";
        $team_message .= '</table>';
        $team_message .= '<p><em>This quote was generated automatically through the website calculator.</em></p>';

        $team_to = [
            'itai@quatrohaus.com',
            'delbert@quatrohaus.com',
            'arlington@quatrohaus.com',
            'info@brightzim.com'
        ];

        $team_subject = "New {$quoteType} Quote Request from {$name} {$surname}";
        $team_headers = [
            "From: Bright Quotes <clientquotes@brightzim.com>",
            "Content-Type: text/html; charset=UTF-8",
            "Reply-To: {$name} <{$customer_email}>"
        ];

        // Send to team
        if (!wp_mail($team_to, $team_subject, $team_message, $team_headers)) {
            error_log('Team email sending failed');
        }

        // 2. Send email to CUSTOMER with PDF attachment
        $customer_subject = "Your {$quoteType} Quote from Bright Insurance Brokers";
        
        $customer_message = '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #3498db, #2ecc71); color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Bright Insurance Brokers</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Your Trusted Insurance Partner</p>
            </div>
            
            <div style="padding: 20px; background: #f9f9f9;">
                <h2 style="color: #2c3e50;">Thank You for Your Interest, ' . $name . '!</h2>
                <p>We have received your inquiry for ' . $quoteType . ' and our team will contact you shortly to discuss your insurance needs.</p>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #2c3e50; margin-top: 0;">Quote Summary</h3>
                    <p><strong>Annual Premium:</strong> US$' . $finalQuote . '</p>
                    <p><strong>' . $termLabel . ' Premium:</strong> US$' . $termQuote . '</p>
                </div>
                
                <p><strong>What happens next?</strong></p>
                <ul>
                    <li>Our insurance specialist will contact you within 24 hours</li>
                    <li>We will answer any questions you may have</li>
                    <li>Help you complete your insurance application</li>
                    <li>Get you covered as quickly as possible</li>
                </ul>
                
                <p>If you have any immediate questions, please contact us at:</p>
                <p>📞 +263 781 165 525<br>
                   📧 info@brightzim.com</p>
                   
                <p style="margin-top: 30px; font-size: 14px; color: #666;">
                    <strong>Bright Insurance Brokers</strong><br>
                    Harare: 5th Floor Beverly Court, Corner Nelson Mandela and Simon V. Muzenda Street<br>
                    Bulawayo: 4th Floor Pioneer House, Corner Fife Street and 8th Avenue
                </p>
            </div>
        </div>';

        $customer_headers = [
            "From: Bright Insurance Brokers <info@brightzim.com>",
            "Content-Type: text/html; charset=UTF-8",
            "Reply-To: info@brightzim.com"
        ];

        // Send to customer
        if (!wp_mail($customer_email, $customer_subject, $customer_message, $customer_headers)) {
            error_log('Customer email sending failed');
            throw new Exception('Failed to send customer email');
        }

        error_log('All emails sent successfully');
        wp_send_json_success(['message' => 'Emails sent successfully']);

    } catch (Exception $e) {
        error_log('send_quote_email Error: ' . $e->getMessage());
        wp_send_json_error(['message' => $e->getMessage()]);
    }
}
