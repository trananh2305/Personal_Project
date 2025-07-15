import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinaryHelpers";

export const  uploadImage = async (buffer: Buffer, folder: string = "default") => {
    try {
        const { url, public_id } = await uploadToCloudinary(buffer, folder);
        return { url, public_id };
    } catch (error) {
        throw new Error(
        `Error uploading image: ${
            error instanceof Error ? error.message : "Unknown error"
        }`
        );
    }
    }

export const deleteImage = async (publicId: string) => {
    try {
        await deleteFromCloudinary(publicId);
    } catch (error) {
        throw new Error(
            `Error deleting image: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

export const updateImage = async (
    oldPublicId: string,
    newBuffer: Buffer,
    folder: string = "default"
) => {
    try {
        const { url, public_id } = await uploadToCloudinary(newBuffer, folder);
        await deleteFromCloudinary(oldPublicId);
        return { url, public_id };
    } catch (error) {
        throw new Error(
            `Error updating image: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}