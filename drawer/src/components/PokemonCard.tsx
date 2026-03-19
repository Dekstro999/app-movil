import { Image, StyleSheet, Text, View } from "react-native";
import { PokemonItem } from "../types/pokemon";

type PokemonCardProps = {
  pokemon: PokemonItem | null;
  isLoading: boolean;
  error: string | null;
};

export default function PokemonCard({
  pokemon,
  isLoading,
  error,
}: PokemonCardProps) {
  if (isLoading) {
    return (
      <View style={styles.card}>
        <View style={[styles.image, styles.skeleton, styles.skeletonImage]} />
        <View style={[styles.skeleton, styles.skeletonTitle]} />
        <View style={[styles.skeleton, styles.skeletonSubtitle]} />
        <View style={[styles.skeleton, styles.skeletonTypes]} />
      </View>
    );
  }

  if (error) {
    return <Text style={[styles.message, styles.error]}>{error}</Text>;
  }

  if (!pokemon) {
    return <Text style={styles.message}>Sin datos</Text>;
  }

  return (
    <View style={styles.card}>
      {pokemon.image ? (
        <Image source={{ uri: pokemon.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>Sin imagen</Text>
        </View>
      )}
      <Text style={styles.title}>{pokemon.name.toUpperCase()}</Text>
      <Text style={styles.subtitle}>#{pokemon.id}</Text>
      <Text style={styles.types}>Tipos: {pokemon.types.join(", ")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    gap: 6,
  },
  image: {
    width: 150,
    height: 150,
  },
  placeholder: {
    borderRadius: 12,
    backgroundColor: "#ececec",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#777",
    fontWeight: "600",
  },
  skeleton: {
    backgroundColor: "#e7e7e7",
    borderRadius: 10,
  },
  skeletonImage: {
    borderRadius: 12,
  },
  skeletonTitle: {
    width: 160,
    height: 24,
  },
  skeletonSubtitle: {
    width: 60,
    height: 16,
  },
  skeletonTypes: {
    width: 190,
    height: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2a2a2a",
  },
  subtitle: {
    color: "#666",
    fontWeight: "600",
  },
  types: {
    color: "#333",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  message: {
    color: "#444",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "#c21616",
  },
});
