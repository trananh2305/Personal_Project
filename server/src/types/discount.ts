export interface Discount {
    _id: string;
    code: string;
    description?: string;
    type: "percentage" | "fixed";
    value: number; // For fixed discounts, this is the amount; for percentage discounts,
    startDate: Date;
    endDate: Date;
    limit?: number; // Optional limit on the number of times the discount can be used
    maxValue?: number; 
    userUsed: string[];// Optional count of how many times the discount has been used
    isActive: boolean;
    }