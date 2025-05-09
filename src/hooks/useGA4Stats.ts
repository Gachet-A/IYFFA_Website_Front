import { useEffect, useState } from "react";

export interface GA4Stats {
  activeUsers: number;
  pageViews: number;
}

// Exemple de stats en dur pour le dev local
const MOCK_GA4_STATS: GA4Stats = {
  activeUsers: 12,
  pageViews: 57,
};

export function useGA4Stats() {
  const [data, setData] = useState<GA4Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simule un appel API (remplace par un fetch réel en prod)
    setTimeout(() => {
      setData(MOCK_GA4_STATS);
      setLoading(false);
    }, 500);
  }, []);

  return { data, loading };
} 