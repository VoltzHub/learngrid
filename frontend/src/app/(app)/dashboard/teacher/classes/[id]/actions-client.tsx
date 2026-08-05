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

function isValidMeetingUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.length > 0;
  } catch {
    return false;
  }
}

export function SessionLinkForm({ classId, currentLink }: { classId: string; currentLink: string | null }) {
  const router = useRouter();
  const [link, setLink] = useState(currentLink ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const trimmed = link.trim();
  const dirty = trimmed !== (currentLink ?? "");
  const valid = isValidMeetingUrl(trimmed);

  async function handleSave() {
    if (!valid) return;
    setSaving(true);
    const result = await updateSessionLink(classId, trimmed);
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
        <Icon name="paperclip" size={14} /> Live Class Link
      </label>
      <p style={{ fontSize: 11, color: "var(--d-gray-500)", margin: "0 0 8px", lineHeight: 1.5 }}>
        Paste your Google Meet, Zoom, or Microsoft Teams link. Enrolled students see it on their dashboard once you save.
      </p>
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
          disabled={saving || !valid || !dirty}
          style={{ minHeight: 40, padding: "0 16px", fontSize: 13, opacity: saving || !valid || !dirty ? 0.5 : 1 }}
        >
          {saving ? "..." : saved ? "✓ Saved" : currentLink ? "Update" : "Save"}
        </button>
      </div>
      {trimmed.length > 0 && !valid && (
        <p style={{ fontSize: 11, color: "var(--d-red)", margin: "6px 0 0" }}>
          Enter a full URL starting with https://
        </p>
      )}
      {currentLink && !dirty && (
        <div style={{ marginTop: 8, padding: "8px 10px", background: "var(--d-gray-50)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 11, color: "var(--d-gray-500)" }}>Current link saved.</span>
          <a href={currentLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 600, color: "var(--d-blue)", textDecoration: "none" }}>
            Open ↗
          </a>
        </div>
      )}
      <p style={{ fontSize: 10, color: "var(--d-gray-400)", margin: "8px 0 0", lineHeight: 1.5 }}>
        Need a Meet link? In Google Calendar, create an event and click <strong>Add Google Meet video conferencing</strong> — the join link appears in the event details.
      </p>
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
