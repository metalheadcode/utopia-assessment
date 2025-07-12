export const generateOrderId = (): string => {
    return `ORDER${Math.floor(1000 + Math.random() * 9000)}`;
};