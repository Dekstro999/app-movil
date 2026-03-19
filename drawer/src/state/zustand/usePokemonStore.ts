import { create } from "zustand";
import { fetchRandomPokemon } from "../../services/pokemonApi";
import { PokemonItem } from "../../types/pokemon";

type PokemonZustandState = {
  pokemon: PokemonItem | null;
  isLoading: boolean;
  error: string | null;
  loadRandomPokemon: () => Promise<void>;
};

export const usePokemonStore = create<PokemonZustandState>((set) => ({
  pokemon: null,
  isLoading: false,
  error: null,
  loadRandomPokemon: async () => {
    set({ isLoading: true, error: null });

    try {
      const pokemon = await fetchRandomPokemon();
      set({ pokemon, isLoading: false });
    } catch {
      set({
        isLoading: false,
        error: "Error cargando Pokémon desde Zustand",
      });
    }
  },
}));
