import { NextResponse } from "next/server";
import { Resend } from 'resend';

interface EmailRequest {
    to: string;
    subject: string;
    clientName: string;
    technicianName: string;
    orderId: string;
    time: string;
    type: "customer" | "technician";
    service?: string; // Additional field for better context
}

export async function POST(request: Request) {
    try {
        // Check environment variable
        if (!process.env.RESEND_API_KEY) {
            console.error("RESEND_API_KEY is not configured");
            return NextResponse.json(
                { error: "Email service not configured" },
                { status: 500 }
            );
        }

        const resend = new Resend(process.env.RESEND_API_KEY);
        const body: EmailRequest = await request.json();

        const { to, subject, clientName, technicianName, orderId, time, type, service } = body;

        // Validate required fields
        if (!to || !subject || !clientName || !orderId || !time || !type) {
            return NextResponse.json(
                { error: "Missing required fields: to, subject, clientName, orderId, time, type" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Validate type
        if (!["customer", "technician"].includes(type)) {
            return NextResponse.json(
                { error: "Type must be either 'customer' or 'technician'" },
                { status: 400 }
            );
        }

        let html = "";

        if (type === "customer") {
            html = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Job Completion Notification</title>
                </head>
                <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                    <div style="background-color: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #1a202c; margin: 0; font-size: 28px;">🎉 Job Completed!</h1>
                        </div>
                        
                        <p style="color: #4a5568; margin-bottom: 16px; font-size: 16px;">Hi ${clientName},</p>
                        
                        <p style="color: #4a5568; margin-bottom: 20px; font-size: 16px;">
                            Great news! Your ${service || 'service'} request has been completed successfully.
                        </p>
                        
                        <div style="background-color: #f7fafc; border-left: 4px solid #4299e1; padding: 20px; margin: 25px 0; border-radius: 6px;">
                            <h3 style="color: #2d3748; margin-top: 0; margin-bottom: 15px;">📋 Job Details</h3>
                            <p style="color: #4a5568; margin: 8px 0;"><strong>Order ID:</strong> #${orderId.slice(-8)}</p>
                            ${service ? `<p style="color: #4a5568; margin: 8px 0;"><strong>Service:</strong> ${service}</p>` : ''}
                            <p style="color: #4a5568; margin: 8px 0;"><strong>Technician:</strong> ${technicianName}</p>
                            <p style="color: #4a5568; margin: 8px 0;"><strong>Completed:</strong> ${time}</p>
                        </div>
                        
                        <div style="background-color: #edf2f7; padding: 20px; border-radius: 8px; margin: 25px 0;">
                            <h3 style="color: #2d3748; margin-top: 0;">💭 We'd Love Your Feedback!</h3>
                            <p style="color: #4a5568; margin-bottom: 0;">Your opinion matters to us. Please take a moment to share your experience.</p>
                        </div>
                        
                        <p style="color: #4a5568; margin-top: 30px; font-size: 16px;">
                            Thank you for choosing SejookNamatey! We appreciate your business.
                        </p>
                        
                        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                            <p style="color: #718096; font-size: 14px; margin: 0;">
                                Questions? Reply to this email or contact our support team.
                            </p>
                        </div>
                    </div>
                </body>
            </html>`;
        }

        if (type === "technician") {
            html = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Job Completion Confirmation</title>
                </head>
                <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                    <div style="background-color: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #1a202c; margin: 0; font-size: 28px;">✅ Great Work!</h1>
                        </div>
                        
                        <p style="color: #4a5568; margin-bottom: 16px; font-size: 16px;">Dear ${technicianName},</p>
                        
                        <p style="color: #4a5568; margin-bottom: 20px; font-size: 16px;">
                            Thank you for successfully completing job <strong>#${orderId.slice(-8)}</strong>. Your dedication and professionalism are greatly appreciated!
                        </p>
                        
                        <div style="background-color: #f0fff4; border-left: 4px solid #48bb78; padding: 20px; margin: 25px 0; border-radius: 6px;">
                            <h3 style="color: #2d3748; margin-top: 0; margin-bottom: 15px;">📋 Completion Summary</h3>
                            <p style="color: #4a5568; margin: 8px 0;"><strong>Customer:</strong> ${clientName}</p>
                            ${service ? `<p style="color: #4a5568; margin: 8px 0;"><strong>Service:</strong> ${service}</p>` : ''}
                            <p style="color: #4a5568; margin: 8px 0;"><strong>Completed:</strong> ${time}</p>
                            <p style="color: #4a5568; margin: 8px 0;"><strong>Status:</strong> Customer has been notified</p>
                        </div>
                        
                        <div style="background-color: #fffaf0; padding: 20px; border-radius: 8px; margin: 25px 0;">
                            <h3 style="color: #2d3748; margin-top: 0;">🌟 Keep Up the Excellence!</h3>
                            <p style="color: #4a5568; margin-bottom: 0;">Your consistent quality work helps maintain our high service standards. Thank you for being a valued team member!</p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                            <p style="color: #718096; font-size: 14px; margin: 0;">
                                SejookNamatey Team Management
                            </p>
                        </div>
                    </div>
                </body>
            </html>`;
        }

        const { data, error } = await resend.emails.send({
            from: 'SejookNamatey <mail@noreply.dexon.dev>',
            to: [to],
            subject: subject,
            html,
        });

        if (error) {
            console.error("Resend error:", error);
            return NextResponse.json({
                error: "Failed to send email",
                details: error.message
            }, { status: 500 });
        }

        console.log(`Email sent successfully to ${to}, type: ${type}`);
        return NextResponse.json({
            success: true,
            emailId: data?.id,
            to: to,
            type: type
        });

    } catch (error) {
        console.error("Email API error:", error);
        return NextResponse.json({
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}