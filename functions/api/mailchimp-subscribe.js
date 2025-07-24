const MAILCHIMP_AUDIENCE_ID = env.MAILCHIMP_AUDIENCE_ID;
const MAILCHIMP_API_KEY = env.MAILCHIMP_API_KEY;

// functions/api/mailchimp-subscribe.js

export async function onRequestPost({ request, env }) {
  try {
    // 1. Parse the incoming form data
    const formData = await request.formData();
    const email = formData.get('email');
    const firstName = formData.get('name'); // Assuming your form has a 'firstName' input

    // 2. Validate essential fields
    if (!email) {
      return new Response(JSON.stringify({ success: false, message: 'Email address is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Retrieve Mailchimp credentials from environment variables (Cloudflare Pages Bindings/Secrets)
    const MAILCHIMP_AUDIENCE_ID = env.MAILCHIMP_AUDIENCE_ID;
    const MAILCHIMP_API_KEY = env.MAILCHIMP_API_KEY;

    if (!MAILCHIMP_AUDIENCE_ID || !MAILCHIMP_API_KEY) {
      console.error('Mailchimp API credentials are not set in environment variables.');
      return new Response(JSON.stringify({ success: false, message: 'Server configuration error.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract the datacenter prefix from the API key (e.g., "us1", "eu1")
    const dataCenter = MAILCHIMP_API_KEY.split('-')[1];
    if (!dataCenter) {
        console.error('Invalid Mailchimp API Key format. Cannot extract datacenter.');
        return new Response(JSON.stringify({ success: false, message: 'Server configuration error: Invalid API Key.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    const mailchimpApiUrl = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;

    // 4. Prepare the request body for Mailchimp API
    // Mailchimp requires specific JSON structure
    const body = {
      email_address: email,
      status: 'pending', // Use 'pending' for double opt-in, 'subscribed' for single opt-in
    };

    if (firstName) {
      body.merge_fields = {
        FNAME: firstName,
        // Add other merge fields if your form collects them (e.g., LNAME, PHONE)
      };
    }

    // 5. Make the POST request to Mailchimp API
    const mailchimpResponse = await fetch(mailchimpApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `apikey ${MAILCHIMP_API_KEY}`, // Mailchimp uses 'apikey' scheme
      },
      body: JSON.stringify(body),
    });

    // 6. Handle the response from Mailchimp
    const mailchimpData = await mailchimpResponse.json();

    if (mailchimpResponse.ok) {
      // Mailchimp returned a successful status code (2xx)
      // Typically, status 200 for update, 204 for creation, etc.
      return new Response(JSON.stringify({
        success: true,
        message: 'Subscription successful! Please check your email to confirm.', // Customize message based on status
        data: mailchimpData
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Mailchimp returned an error status code (4xx or 5xx)
      console.error('Mailchimp API error:', mailchimpData);
      let errorMessage = 'Subscription failed. Please try again.';

      // Parse Mailchimp error details for a more specific message
      if (mailchimpData && mailchimpData.detail) {
        errorMessage = mailchimpData.detail;
      } else if (mailchimpData && mailchimpData.title) {
        errorMessage = mailchimpData.title;
      }

      // Check for common Mailchimp errors
      if (mailchimpData.title === 'Member Exists') {
        errorMessage = 'You are already subscribed to our list!';
      }

      return new Response(JSON.stringify({
        success: false,
        message: errorMessage
      }), {
        status: mailchimpResponse.status, // Use Mailchimp's status code
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    // 7. Handle any unexpected errors during the process
    console.error('Error processing subscription request:', error);
    return new Response(JSON.stringify({ success: false, message: 'An unexpected error occurred. Please try again later.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
