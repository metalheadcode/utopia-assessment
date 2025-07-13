import { NextRequest, NextResponse } from "next/server";

interface WhatsAppRequest {
    to: string;
    message: string;
    type?: "customer" | "technician";
}

export async function POST(request: NextRequest) {
    try {
        const { to, message, type }: WhatsAppRequest = await request.json();

        // Validate required fields
        if (!to || !message) {
            return NextResponse.json(
                { error: "Phone number and message are required" },
                { status: 400 }
            );
        }

        // Validate phone number format (basic validation)
        const phoneRegex = /^\+\d{10,15}$/;
        if (!phoneRegex.test(to)) {
            return NextResponse.json(
                { error: "Invalid phone number format. Use +60xxxxxxxxx" },
                { status: 400 }
            );
        }

        console.log(phoneRegex)

        // Validate environment variables
        if (!process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
            console.error("Missing WhatsApp environment variables");
            return NextResponse.json(
                { error: "WhatsApp configuration error" },
                { status: 500 }
            );
        }

        const url = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

        const whatsappResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to,
                type: "text",
                text: {
                    body: message
                }
            }),
        });

        console.log(whatsappResponse)

        // ✅ FIXED: Get the actual JSON data
        const responseData = await whatsappResponse.json();

        if (!whatsappResponse.ok) {
            console.error("WhatsApp API error:", responseData);
            return NextResponse.json(
                {
                    error: "Failed to send WhatsApp message",
                    details: responseData.error?.message || "Unknown error"
                },
                { status: whatsappResponse.status }
            );
        }

        console.log(`WhatsApp ${type || 'message'} sent successfully to ${to}`);
        return NextResponse.json({
            success: true,
            messageId: responseData.messages?.[0]?.id,
            to: to
        });

    } catch (error) {
        console.error("WhatsApp API route error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}