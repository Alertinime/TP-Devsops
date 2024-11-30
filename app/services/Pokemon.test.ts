import { describe, it, expect, vi } from "vitest";
import { PokemonService } from "~/services/PokemonService";
import { PokeApiClient } from "~/services/PokeApiClient";
import { Pokemon } from "~/services/pokemon";

// Mock de PokeApiClient
vi.mock("~/services/PokeApiClient");

describe("PokemonService", () => {
  const createPokemonService = () => {
    const pokeApiClientMock = new PokeApiClient() as vi.Mocked<PokeApiClient>;
    const pokemonService = new PokemonService(pokeApiClientMock);
    return { pokeApiClientMock, pokemonService };
  };

  it("getPokemonList test for,well,the list", async () => {
    const { pokeApiClientMock, pokemonService } = createPokemonService();
    const mockPokemonList: Pokemon[] = [{ id: 1, name: "Bulbasaur" }];

    pokeApiClientMock.getPokemonList.mockResolvedValue(mockPokemonList);

    const result = await pokemonService.getPokemonList();

    expect(pokeApiClientMock.getPokemonList).toHaveBeenCalledOnce();
    expect(result).toEqual(mockPokemonList);
  });

  it("getUserTeam test if the function really send nothing if the user dont have a team, go see chen dude", () => {
    const { pokemonService } = createPokemonService();

    const team = pokemonService.getUserTeam("user1");

    expect(team).toEqual([]);
  });

  it("getUserTeam test to test if, in reverse,, whe get the team of an user if he had one", () => {
    const { pokemonService } = createPokemonService();
    const pokemon: Pokemon = { id: 1, name: "Bulbasaur" };

    pokemonService.togglePokemonInTeam("user1", pokemon);
    const team = pokemonService.getUserTeam("user1");

    expect(team).toEqual([pokemon]);
  });

  it("clearTeam test if clear a user’s team, rip pokemon", () => {
    const { pokemonService } = createPokemonService();
    const pokemon: Pokemon = { id: 1, name: "Bulbasaur" };

    pokemonService.togglePokemonInTeam("user1", pokemon);
    pokemonService.clearTeam("user1");

    const team = pokemonService.getUserTeam("user1");

    expect(team).toEqual([]);
  });

  it("togglePokemonInTeam test to add a new battle slave, hum pokemon", () => {
    const { pokemonService } = createPokemonService();
    const pokemon: Pokemon = { id: 1, name: "Bulbasaur" };

    const result = pokemonService.togglePokemonInTeam("user1", pokemon);

    expect(result).toBe(true);
    expect(pokemonService.getUserTeam("user1")).toContainEqual(pokemon);
  });

  it("togglePokemonInTeam test to remove a pokemon, if you dont performe you go out", () => {
    const { pokemonService } = createPokemonService();
    const pokemon: Pokemon = { id: 1, name: "Bulbasaur" };

    pokemonService.togglePokemonInTeam("user1", pokemon);
    const result = pokemonService.togglePokemonInTeam("user1", pokemon);

    expect(result).toBe(true);
    expect(pokemonService.getUserTeam("user1")).not.toContainEqual(pokemon);
  });

  it("togglePokemonInTeam test to verifie is the function dont allow syblings", () => {
    const { pokemonService } = createPokemonService();
    const pokemon: Pokemon = { id: 1, name: "Bulbasaur" };

    pokemonService.togglePokemonInTeam("user1", pokemon);
    const duplicateResult = pokemonService.togglePokemonInTeam(
      "user1",
      pokemon,
    );

    expect(duplicateResult).toBe(true);
    expect(pokemonService.getUserTeam("user1")).toEqual([]);
  });

  it("togglePokemonInTeam test to see if whe have a good visio, and dont allow more then 6 ppl to the party", () => {
    const { pokemonService } = createPokemonService();

    for (let i = 1; i <= 6; i++) {
      const pokemon: Pokemon = { id: i, name: `Pokemon${i}` };
      pokemonService.togglePokemonInTeam("user1", pokemon);
    }

    const extraPokemon: Pokemon = { id: 7, name: "ExtraPokemon" };
    const result = pokemonService.togglePokemonInTeam("user1", extraPokemon);

    expect(result).toBe(false);
    expect(pokemonService.getUserTeam("user1")).toHaveLength(6);
  });
});
