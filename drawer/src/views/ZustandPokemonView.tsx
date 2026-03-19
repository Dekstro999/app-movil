import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import PokemonCard from "../components/PokemonCard";
import { usePokemonStore } from "../state/zustand/usePokemonStore";

export default function ZustandPokemonView() {
  const { pokemon, isLoading, error, loadRandomPokemon } = usePokemonStore();
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [lastLoadMs, setLastLoadMs] = useState<number | null>(null);

  const handleLoadPokemon = () => {
    setStartedAt(Date.now());
    void loadRandomPokemon();
  };

  useEffect(() => {
    if (!pokemon) {
      handleLoadPokemon();
    }
  }, [pokemon]);

  useEffect(() => {
    if (!isLoading && startedAt) {
      setLastLoadMs(Date.now() - startedAt);
      setStartedAt(null);
    }
  }, [isLoading, startedAt]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zustand</Text>
      <Text style={styles.description}>Estado global con store minimalista</Text>
      <Text style={styles.metric}>
        Tiempo de carga: {lastLoadMs ? `${lastLoadMs} ms` : "--"}
      </Text>

      <PokemonCard pokemon={pokemon} isLoading={isLoading} error={error} />

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleLoadPokemon}
      >
        <Text style={styles.buttonText}>Cargar otro Pokémon</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#28044d",
  },
  description: {
    color: "#555",
  },
  metric: {
    color: "#404040",
    fontWeight: "600",
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#6d28d9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
