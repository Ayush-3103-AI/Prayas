const axios = require('axios');

// Send WhatsApp message using WhatsApp Business API
const sendMessage = async (phoneNumber, message) => {
  try {
    // Placeholder for WhatsApp Business API integration
    // Replace with actual WhatsApp Business API implementation
    
    if (!process.env.WHATSAPP_API_KEY || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
      console.log(`[WhatsApp] Would send to ${phoneNumber}: ${message}`);
      return { success: true, message: 'WhatsApp API not configured, logged to console' };
    }

    // Example WhatsApp Business API call (adjust based on your provider)
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error('WhatsApp API Error:', error.message);
    // Don't throw error - notifications are non-critical
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendMessage,
};

