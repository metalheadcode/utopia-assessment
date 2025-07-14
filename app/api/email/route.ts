import { NextResponse } from "next/server";
import { Resend } from 'resend';

interface EmailRequest {
    to: string;
    subject: string;
    clientName: string;
    technicianName?: string;
    orderId?: string;
    time?: string;
    type: "customer" | "technician" | "customer_login_link";
    service?: string; // Additional field for better context
    signInLink?: string; // For customer login links
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

        const { to, subject, clientName, technicianName, orderId, time, type, service, signInLink } = body;

        // Validate required fields - different requirements for different types
        if (!to || !subject || !clientName || !type) {
            return NextResponse.json(
                { error: "Missing required fields: to, subject, clientName, type" },
                { status: 400 }
            );
        }

        // Additional validation for specific types
        if (type === "customer_login_link" && !signInLink) {
            return NextResponse.json(
                { error: "signInLink is required for customer_login_link type" },
                { status: 400 }
            );
        }

        if ((type === "customer" || type === "technician") && (!orderId || !time)) {
            return NextResponse.json(
                { error: "orderId and time are required for customer/technician types" },
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
        if (!["customer", "technician", "customer_login_link"].includes(type)) {
            return NextResponse.json(
                { error: "Type must be either 'customer', 'technician', or 'customer_login_link'" },
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
                            <p style="color: #4a5568; margin: 8px 0;"><strong>Order ID:</strong> #${orderId?.slice(-8)}</p>
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
                            Thank you for successfully completing job <strong>#${orderId?.slice(-8)}</strong>. Your dedication and professionalism are greatly appreciated!
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

        if (type === "customer_login_link") {
            html = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Access Your Service Order Status</title>
                </head>
                <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                    <div style="background-color: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #1a202c; margin: 0; font-size: 28px;">🔐 Access Your Service Order</h1>
                        </div>
                        
                        <p style="color: #4a5568; margin-bottom: 16px; font-size: 16px;">Hello ${clientName},</p>
                        
                        <p style="color: #4a5568; margin-bottom: 20px; font-size: 16px;">
                            Welcome to SejookNamatey! We've created an account for you to track your service order status and stay updated on your air conditioning services.
                        </p>
                        
                        <div style="background-color: #f7fafc; border-left: 4px solid #4299e1; padding: 20px; margin: 25px 0; border-radius: 6px;">
                            <h3 style="color: #2d3748; margin-top: 0; margin-bottom: 15px;">📱 What You Can Do</h3>
                            <ul style="color: #4a5568; margin: 0; padding-left: 20px;">
                                <li>Track your service order status in real-time</li>
                                <li>View order details and technician information</li>
                                <li>Receive notifications when your job is completed</li>
                                <li>Access your service history</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${signInLink}" style="background-color: #4299e1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
                                🚀 Access Your Account
                            </a>
                        </div>
                        
                        <div style="background-color: #fff5f5; border-left: 4px solid #f56565; padding: 20px; margin: 25px 0; border-radius: 6px;">
                            <h3 style="color: #2d3748; margin-top: 0; margin-bottom: 15px;">⚠️ Important Notes</h3>
                            <ul style="color: #4a5568; margin: 0; padding-left: 20px;">
                                <li>This login link is valid for 60 minutes</li>
                                <li>Click the link on the same device where you want to access your account</li>
                                <li>If the link expires, contact us for a new one</li>
                            </ul>
                        </div>
                        
                        <p style="color: #4a5568; margin-top: 30px; font-size: 16px;">
                            Thank you for choosing SejookNamatey for your air conditioning service needs!
                        </p>
                        
                        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                            <p style="color: #718096; font-size: 14px; margin: 0;">
                                Need help? Reply to this email or contact our support team.
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