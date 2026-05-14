// Default cover images per subject. Sourced from Unsplash (free to hotlink).
// Width clamped at 1200 to keep marketplace bundle small.
const SUBJECT_COVERS: Record<string, string> = {
  Mathematics: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=70&auto=format&fit=crop",
  "Further Maths": "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&q=70&auto=format&fit=crop",
  Physics: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=1200&q=70&auto=format&fit=crop",
  Chemistry: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=70&auto=format&fit=crop",
  Biology: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&q=70&auto=format&fit=crop",
  English: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=70&auto=format&fit=crop",
  Languages: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=70&auto=format&fit=crop",
  ICT: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=70&auto=format&fit=crop",
  Computing: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=70&auto=format&fit=crop",
  Economics: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=70&auto=format&fit=crop",
  Business: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=70&auto=format&fit=crop",
  History: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&q=70&auto=format&fit=crop",
  Geography: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=70&auto=format&fit=crop",
};

const FALLBACK = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=70&auto=format&fit=crop";

export function getClassCover(opts: { coverImageUrl?: string | null; subject: string }): string {
  if (opts.coverImageUrl) return opts.coverImageUrl;
  return SUBJECT_COVERS[opts.subject] ?? FALLBACK;
}

export const SUBJECT_COVER_OPTIONS = Object.entries(SUBJECT_COVERS).map(([subject, url]) => ({
  subject,
  url,
}));
