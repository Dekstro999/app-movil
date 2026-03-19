import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { fetchRandomPokemon } from "../services/pokemonApi";
import { PokemonItem } from "../types/pokemon";

type PokemonContextValue = {
  pokemon: PokemonItem | null;
  isLoading: boolean;
  error: string | null;
  loadRandomPokemon: () => Promise<void>;
};

const PokemonContext = createContext<PokemonContextValue | undefined>(undefined);

export function PokemonProvider({ children }: PropsWithChildren) {
  const [pokemon, setPokemon] = useState<PokemonItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRandomPokemon = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextPokemon = await fetchRandomPokemon();
      setPokemon(nextPokemon);
    } catch {
      setError("Error cargando Pokémon desde Context API");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ pokemon, isLoading, error, loadRandomPokemon }),
    [pokemon, isLoading, error, loadRandomPokemon]
  );

  return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>;
}

export function usePokemonContext() {
  const context = useContext(PokemonContext);

  if (!context) {
    throw new Error("usePokemonContext debe usarse dentro de PokemonProvider");
  }

  return context;
}
