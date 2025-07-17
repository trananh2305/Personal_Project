export interface Table {
    _id: string;
    name: string;
    description?: string;
    qrCode?: string;
    public_id?: string;
    slug: string;
    status: "OCCUPIED" | "UNOCCUPIED" ;
    createdAt: Date;
    updatedAt: Date;

}