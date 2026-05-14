'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  handles: string[];
  toggle: (handle: string) => void;
  isWishlisted: (handle: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      handles: [],
      toggle: (handle) =>
        set((s) => ({
          handles: s.handles.includes(handle)
            ? s.handles.filter((h) => h !== handle)
            : [...s.handles, handle],
        })),
      isWishlisted: (handle) => get().handles.includes(handle),
    }),
    { name: 'ef-wishlist' }
  )
);
