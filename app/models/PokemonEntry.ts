import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * This represents an Pokedex with multiple Pokemon.
 */
export const PokemonEntryModel = types
  .model("PokemonEntry")
  .props({
    entry_number: types.number,
    pokemon_species: types.model({
      name: "",
      url: "",
    }),
  })
  .actions(withSetPropAction)

export interface PokemonEntry extends Instance<typeof PokemonEntryModel> {}
export interface PokemonEntrySnapshotOut extends SnapshotOut<typeof PokemonEntryModel> {}
export interface PokemonEntrySnapshotIn extends SnapshotIn<typeof PokemonEntryModel> {}
