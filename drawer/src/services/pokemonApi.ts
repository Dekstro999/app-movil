import { PokemonItem } from "../types/pokemon";

type PokemonApiResponse = {
  id: number;
  name: string;
  sprites: {
    other?: {
      "official-artwork"?: {
        front_default?: string | null;
      };
    };
    front_default?: string | null;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
};

const POKE_API_BASE = "https://pokeapi.co/api/v2/pokemon";
const MAX_POKEMON_ID = 151;

function mapPokemonResponse(data: PokemonApiResponse): PokemonItem {
  const officialArtwork = data.sprites.other?.["official-artwork"]?.front_default;
  const fallbackImage = data.sprites.front_default;

  return {
    id: data.id,
    name: data.name,
    image: officialArtwork ?? fallbackImage ?? "",
    types: data.types.map((typeItem) => typeItem.type.name),
  };
}

export async function fetchPokemonById(id: number): Promise<PokemonItem> {
  const response = await fetch(`${POKE_API_BASE}/${id}`);

  if (!response.ok) {
    throw new Error("No se pudo obtener el Pokémon");
  }

  const data = (await response.json()) as PokemonApiResponse;
  return mapPokemonResponse(data);
}

export async function fetchRandomPokemon(): Promise<PokemonItem> {
  const randomId = Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
  return fetchPokemonById(randomId);
}
