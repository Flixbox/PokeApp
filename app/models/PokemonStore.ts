import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { PokemonEntryModel } from "./PokemonEntry"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const PokemonStoreModel = types
  .model("PokemonStore")
  .props({
    pokedex: types.array(PokemonEntryModel),
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
  }))
  .views(() => ({
    pokemonImage(id) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    },
  }))

export interface PokemonStore extends Instance<typeof PokemonStoreModel> {}
export interface PokemonStoreSnapshot extends SnapshotOut<typeof PokemonStoreModel> {}

// @demo remove-file
