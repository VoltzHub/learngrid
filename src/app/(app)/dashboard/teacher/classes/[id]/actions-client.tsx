"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { publishClass, cancelClass, deleteClass } from "@/lib/actions/classes";
import { updateSessionLink, markClassCompleted } from "@/lib/actions/session";
import { Icon } from "@/components/Icons";

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

export function SessionLinkForm({ classId, currentLink }: { classId: string; currentLink: string | null }) {
  const router = useRouter();
  const [link, setLink] = useState(currentLink ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!link.trim()) return;
    setSaving(true);
    const result = await updateSessionLink(classId, link.trim());
    setSaving(false);
    if ("error" in result) {
      alert(result.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    }
  }

  return (
    <div className="session-link-form">
      <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="megaphone" size={14} /> Session Link (Zoom / Google Meet)
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="form-input"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://meet.google.com/abc-defg-hij"
          style={{ flex: 1 }}
        />
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving || !link.trim()}
          style={{ minHeight: 40, padding: "0 16px", fontSize: 13, opacity: saving ? 0.5 : 1 }}
        >
          {saving ? "..." : saved ? "✓" : "Save"}
        </button>
      </div>
      {currentLink && (
        <p style={{ fontSize: 11, color: "var(--d-gray-400)", margin: "4px 0 0" }}>
          Students will see this link once they enrol.
        </p>
      )}
    </div>
  );
}

export function CompleteClassButton({ classId }: { classId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    if (!confirm("Mark this class as completed? This will release earnings.")) return;
    setLoading(true);
    const result = await markClassCompleted(classId);
    setLoading(false);
    if ("error" in result) {
      alert(result.error);
    } else {
      router.refresh();
    }
  }

  return (
    <button
      className="btn btn-success btn-block"
      onClick={handleComplete}
      disabled={loading}
      style={{ marginBottom: 10, opacity: loading ? 0.5 : 1 }}
    >
      {loading ? "Completing..." : "✓ Mark as Completed"}
    </button>
  );
}
