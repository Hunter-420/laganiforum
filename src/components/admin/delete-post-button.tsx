"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deletePostAction } from "@/app/admin/posts/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDialog } from "@/components/ui/dialog";

export function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { confirm, toast } = useDialog();

  const handleDelete = () => {
    confirm({
      title: "Delete post",
      description: "Are you sure you want to delete this post? This action cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        setIsDeleting(true);
        const result = await deletePostAction(id);
        if (result.success) {
          toast("Post deleted", "success");
          router.refresh();
        } else {
          toast(result.error || "Failed to delete post", "error");
          setIsDeleting(false);
        }
      },
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-destructive"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
