import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * This represents an single Pokemon.
 */
export const PokemonModel = types
  .model("Pokemon")
  .props({
    guid: types.identifier,
    title: "",
    pubDate: "", // Ex: 2022-08-12 21:05:36
    link: "",
    author: "",
    thumbnail: "",
    description: "",
    content: "",
    categories: types.array(types.string),
  })
  .actions(withSetPropAction)

export interface Pokemon extends Instance<typeof PokemonModel> {}
export interface PokemonSnapshotOut extends SnapshotOut<typeof PokemonModel> {}
export interface PokemonSnapshotIn extends SnapshotIn<typeof PokemonModel> {}
