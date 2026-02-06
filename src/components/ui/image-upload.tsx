"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ImagePlus, Trash, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  bucketName?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  bucketName = "hero-slides",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large (Max 5MB)");
      return;
    }

    try {
      setIsUploading(true);

      // 1. Generate Unique Filename to avoid conflicts
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 3. Get Public URL
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // 4. Update Parent Form
      onChange(data.publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error("Upload Error:", error);
      toast.error("Upload failed", { description: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* PREVIEW AREA */}
      {value ? (
        <div className="relative w-full h-[200px] rounded-md overflow-hidden border border-border bg-gray-100">
          <div className="absolute top-2 right-2 z-10">
            <Button
              type="button"
              onClick={onRemove}
              variant="destructive"
              size="icon"
              className="h-8 w-8"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          
          {/* ✅ FIX: Added unoptimized to bypass Next.js strict checks */}
          <Image
            src={value}
            alt="Upload Preview"
            fill
            className="object-cover"
            unoptimized 
          />
        </div>
      ) : (
        /* UPLOAD BUTTON AREA */
        <div className="w-full h-[150px] relative rounded-md border-2 border-dashed border-input bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center gap-2">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">Uploading...</p>
            </div>
          ) : (
            <>
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm text-muted-foreground font-medium">
                Click to upload image
              </div>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={onUpload}
                disabled={isUploading}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}