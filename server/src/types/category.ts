export interface Category {
    _id?: string; // Optional for new categories
    name: string;
    description?: string;
    imageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
