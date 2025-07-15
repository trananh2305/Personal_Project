export interface DishRes {
    _id?: string; // Optional for new dishes
    name: string;
    description?: string;
    price: number;
    categoryId: string[]; // Array of Category IDs
    image?:Buffer;
    ingredients?: string[]; // Array of Ingredient IDs
    createdAt?: Date;
    updatedAt?: Date;
}