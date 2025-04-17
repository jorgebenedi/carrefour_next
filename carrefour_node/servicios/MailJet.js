const axios = require("axios");

module.exports = {
    EnviarEmail: async (to, subject, body, htmlbody) => {
        try {
            const _credsBase64 = Buffer
                .from(`${process.env.MJ_APIKEY_PUBLIC}:${process.env.MJ_APIKEY_PRIVATE}`)
                .toString("base64");
    
            const _mensaje = {
                "Messages": [ 
                    {
                        "From": {
                            "Email": process.env.EMAIL_ADMIN,
                            "Name": "Carrefour"
                        },
                        "To": [
                            {
                                "Email": to,
                                "Name": to
                            }
                        ],
                        "Subject": subject,
                        "TextPart": body,
                        "HTMLPart": htmlbody
                    }
                ]
            };
    
            const response = await axios.post(
                "https://api.mailjet.com/v3.1/send",
                _mensaje,
                {
                    headers: {
                        Authorization: `Basic ${_credsBase64}`,
                        "Content-Type": "application/json"
                    }
                }
            );
    
            console.log("✅ Email enviado con éxito:", response.data);
            return { success: true, response: response.data };
        } catch (error) {
            console.error("❌ Error al enviar email:", error.response ? error.response.data : error.message);
            return { success: false, error: error.message };
        }
    }
};    