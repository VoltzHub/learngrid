"use client";

import { useRouter } from "next/navigation";
import { publishClass, cancelClass, deleteClass } from "@/lib/actions/classes";

export function PublishButton({ classId }: { classId: string }) {
  const router = useRouter();
  async function handlePublish() {
    const result = await publishClass(classId);
    if ("error" in result) {
      alert(result.error);
    } else {
      router.refresh();
    }
  }
  return (
    <button className="btn btn-primary btn-block" onClick={handlePublish}>
      Publish Class
    </button>
  );
}

export function CancelButton({ classId }: { classId: string }) {
  const router = useRouter();
  async function handleCancel() {
    if (!confirm("Cancel this class? All enrolled students will be refunded.")) return;
    const result = await cancelClass(classId);
    if ("error" in result) {
      alert(result.error);
    } else {
      router.refresh();
    }
  }
  return (
    <button className="btn-outline-danger" onClick={handleCancel} style={{ flex: 1 }}>
      Cancel Class
    </button>
  );
}

export function DeleteButton({ classId }: { classId: string }) {
  async function handleDelete() {
    if (!confirm("Delete this draft permanently?")) return;
    await deleteClass(classId);
  }
  return (
    <button className="btn-outline-danger" onClick={handleDelete} style={{ flex: 1 }}>
      Delete Draft
    </button>
  );
}
