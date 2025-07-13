"use client"

import { createContext, useContext, useState } from "react";

interface WhatsappContextType {
    sendJobCompletionMessage: (params: JobCompletionParams) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    success: string | null;
    clearMessages: () => void;
}

interface JobCompletionParams {
    customerName: string;
    customerPhone: string;
    orderId: string;
    service: string;
    technicianName: string;
    technicianPhone?: string; // Optional if you want to notify technician too
    completedAt: string;
}

export const WhatsappContext = createContext<WhatsappContextType>({} as WhatsappContextType);

// IMPROVED MESSAGE TEMPLATES
const customerMessageTemplate = (params: JobCompletionParams) => `
🎉 *Job Completed!*

Hello ${params.customerName},

Your ${params.service} job has been completed successfully!

📋 *Order Details:*
- Order ID: #${params.orderId.slice(-8)}
- Service: ${params.service}
- Technician: ${params.technicianName}
- Completed: ${params.completedAt}

Thank you for choosing our services! 😊

If you have any questions, feel free to contact us.
`.trim();

const technicianMessageTemplate = (params: JobCompletionParams) => `
✅ *Job Completion Confirmed*

Dear ${params.technicianName},

We confirm receipt of job completion:

📋 *Order Details:*
- Order ID: #${params.orderId.slice(-8)}
- Customer: ${params.customerName}
- Service: ${params.service}
- Completed: ${params.completedAt}

The customer has been notified. Thank you for your service! 👍
`.trim();

export const WhatsappProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    const sendJobCompletionMessage = async (params: JobCompletionParams) => {
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(null);

            // Send message to customer
            const customerMessage = customerMessageTemplate(params);
            const customerResponse = await fetch("/api/whatsapp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    to: params.customerPhone,
                    message: customerMessage,
                    type: "customer"
                })
            });

            if (!customerResponse.ok) {
                const errorData = await customerResponse.json();
                throw new Error(errorData.error || "Failed to send customer notification");
            }

            // Optionally send message to technician
            if (params.technicianPhone) {
                const technicianMessage = technicianMessageTemplate(params);
                const technicianResponse = await fetch("/api/whatsapp", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        to: params.technicianPhone,
                        message: technicianMessage,
                        type: "technician"
                    })
                });

                if (!technicianResponse.ok) {
                    console.warn("Failed to send technician notification");
                    // Don't throw error for technician notification failure
                }
            }

            setSuccess("Customer has been notified via WhatsApp!");

        } catch (error) {
            console.error("WhatsApp sending error:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to send WhatsApp message";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <WhatsappContext.Provider value={{
            sendJobCompletionMessage,
            isLoading,
            error,
            success,
            clearMessages
        }}>
            {children}
        </WhatsappContext.Provider>
    );
};

export const useWhatsapp = () => {
    return useContext(WhatsappContext);
};