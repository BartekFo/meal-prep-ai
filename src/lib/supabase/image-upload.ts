import { createClient } from "@/lib/supabase/server";

interface IUploadImageToSupabaseArgs {
  imageFile: Blob | undefined;
  title?: string;
  userId: string;
  bucketName: string;
}

const isFile = (file: Blob): file is File => {
  return "name" in file;
};

export async function uploadImageToSupabase({
  imageFile,
  userId,
  bucketName,
}: IUploadImageToSupabaseArgs) {
  try {
    const supabase = await createClient();

    if (!imageFile) return null;

    if (!isFile(imageFile)) {
      throw new Error("Image file is not a File");
    }

    const fileName = `${userId}/${imageFile.name}`;

    const { error, data } = await supabase.storage
      .from(bucketName)
      .upload(fileName, imageFile, {
        upsert: true,
      });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    return data.path;
  } catch (error) {
    console.error("Error in uploadImageToSupabase:", error);
    return null;
  }
}
