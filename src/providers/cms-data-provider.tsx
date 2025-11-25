"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { CmsData, SiteIdentity, cmsDataSchema, defaultCmsData, type HomepageContent, type ArtLibrary, type Exposition } from "@/lib/cms";
import { createCmsRepository, type CmsRepository } from "@/lib/cms/repository";

type CmsDataContextValue = {
  data: CmsData;
  status: "loading" | "ready" | "error";
  error?: string;
  lastSavedAt?: number;
  updateData: (updater: (prev: CmsData) => CmsData) => void;
  updateSiteIdentity: (updater: (prev: SiteIdentity) => SiteIdentity) => void;
  updateHomepage: (updater: (prev: HomepageContent) => HomepageContent) => void;
  updateArtLibrary: (updater: (prev: ArtLibrary) => ArtLibrary) => void;
  updateExpositions: (updater: (prev: Exposition[]) => Exposition[]) => void;
  replaceData: (next: CmsData) => void;
  reset: () => void;
};

const CmsDataContext = createContext<CmsDataContextValue | undefined>(undefined);

export const CmsDataProvider = ({ children, initialData }: { children: React.ReactNode; initialData?: CmsData }) => {
  const hasInitialData = Boolean(initialData);
  const [data, setData] = useState<CmsData>(initialData ?? defaultCmsData);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(hasInitialData ? "ready" : "loading");
  const [error, setError] = useState<string>();
  const [lastSavedAt, setLastSavedAt] = useState<number>();
  const [repository] = useState<CmsRepository>(() => createCmsRepository());

  useEffect(() => {
    if (hasInitialData) {
      return;
    }

    let cancelled = false;
    setStatus("loading");

    repository
      .load()
      .then((payload) => {
        if (cancelled) return;
        setData(payload);
        setStatus("ready");
        setError(undefined);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setStatus("error");
        setError(err instanceof Error ? err.message : "Nu s-au putut încărca datele.");
      });

    return () => {
      cancelled = true;
    };
  }, [repository, hasInitialData, initialData]);

  useEffect(() => {
    if (status !== "ready") {
      return;
    }
    let cancelled = false;
    repository
      .save(data)
      .then(() => {
        if (!cancelled) {
          setLastSavedAt(Date.now());
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err);
          setError("Nu s-au putut salva modificările.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [data, status, repository]);

  const replaceData = useCallback((next: CmsData) => {
    try {
      const parsed = cmsDataSchema.parse(next);
      setData(parsed);
      setStatus("ready");
      setError(undefined);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Nu s-a putut salva actualizarea.");
    }
  }, []);

  const updateData = useCallback(
    (updater: (prev: CmsData) => CmsData) => {
      if (status === "error") {
        return;
      }

      setData((prev) => {
        try {
          const candidate = updater(prev);
          return cmsDataSchema.parse(candidate);
        } catch (err) {
          console.error(err);
          setError(err instanceof Error ? err.message : "Actualizarea nu a trecut de validare.");
          return prev;
        }
      });
    },
    [status],
  );

  const updateSiteIdentity = useCallback(
    (updater: (prev: SiteIdentity) => SiteIdentity) => {
      updateData((prev) => ({
        ...prev,
        siteIdentity: updater(prev.siteIdentity),
      }));
    },
    [updateData],
  );

  const updateHomepage = useCallback(
    (updater: (prev: HomepageContent) => HomepageContent) => {
      updateData((prev) => ({
        ...prev,
        homepage: updater(prev.homepage),
      }));
    },
    [updateData],
  );

  const updateArtLibrary = useCallback(
    (updater: (prev: ArtLibrary) => ArtLibrary) => {
      updateData((prev) => ({
        ...prev,
        artLibrary: updater(prev.artLibrary),
      }));
    },
    [updateData],
  );

  const updateExpositions = useCallback(
    (updater: (prev: Exposition[]) => Exposition[]) => {
      updateData((prev) => ({
        ...prev,
        expositions: updater(prev.expositions),
      }));
    },
    [updateData],
  );

  const reset = useCallback(() => {
    setStatus("loading");
    repository
      .reset()
      .then((payload) => {
        setData(payload);
        setStatus("ready");
        setError(undefined);
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
        setError(err instanceof Error ? err.message : "Nu s-a putut reseta conținutul.");
      });
  }, [repository]);

  const value = useMemo(
    () => ({
      data,
      status,
      error,
      lastSavedAt,
      updateData,
      updateSiteIdentity,
      updateHomepage,
      updateArtLibrary,
      updateExpositions,
      replaceData,
      reset,
    }),
    [data, status, error, lastSavedAt, updateData, updateSiteIdentity, updateHomepage, updateArtLibrary, updateExpositions, replaceData, reset],
  );

  return <CmsDataContext.Provider value={value}>{children}</CmsDataContext.Provider>;
};

export const useCmsData = () => {
  const context = useContext(CmsDataContext);

  if (!context) {
    throw new Error("useCmsData must be used within CmsDataProvider");
  }

  return context;
};
