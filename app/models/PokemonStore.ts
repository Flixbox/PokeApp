import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { PokemonEntryModel } from "./PokemonEntry"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const PokemonStoreModel = types
  .model("PokemonStore")
  .props({
    pokedex: types.array(PokemonEntryModel),
    selectedPokemonId: types.maybeNull(types.number),
    selectedPokemonDetails: types.frozen(),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchPokedex() {
      const response = await api.getPokedex()
      if (response.kind === "ok") {
        store.setProp("pokedex", response.pokedex)
      } else {
        console.tron.error(`Error fetching pokedex: ${JSON.stringify(response)}`, [])
      }
    },
    async fetchSelectedPokemonData(id: number) {
      const response = await api.getSelectedPokemonData(id)
      if (response.kind === "ok") {
        store.setProp("selectedPokemonDetails", response.pokemonDetails)
      } else {
        console.tron.error(`Error fetching pokemon data: ${JSON.stringify(response)}`, [])
      }
    },
    setSelectedPokemon(id: number) {
      store.setProp("selectedPokemonId", id)
    },
  }))
  .views(() => ({
    pokemonImage(id) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    },
  }))

export interface PokemonStore extends Instance<typeof PokemonStoreModel> {}
export interface PokemonStoreSnapshot extends SnapshotOut<typeof PokemonStoreModel> {}

// @demo remove-file
