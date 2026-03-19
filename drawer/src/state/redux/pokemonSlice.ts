import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchRandomPokemon } from "../../services/pokemonApi";
import { PokemonItem } from "../../types/pokemon";

type PokemonReduxState = {
  pokemon: PokemonItem | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: PokemonReduxState = {
  pokemon: null,
  isLoading: false,
  error: null,
};

export const loadRandomPokemonThunk = createAsyncThunk(
  "pokemon/loadRandom",
  async () => {
    const pokemon = await fetchRandomPokemon();
    return pokemon;
  }
);

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadRandomPokemonThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadRandomPokemonThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pokemon = action.payload;
      })
      .addCase(loadRandomPokemonThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = "Error cargando Pokémon desde Redux Toolkit";
      });
  },
});

export default pokemonSlice.reducer;
