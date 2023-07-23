import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * This represents a detailed Pokemon entry.
 */
export const PokemonDetailsModel = types
  .model("PokemonDetails")
  .props({
    abilities: types.array(
      types.model({
        ability: types.model({
          name: "",
          url: "",
        }),
        is_hidden: false,
        slot: 0,
      }),
    ),
    base_experience: 0,
    forms: types.array(
      types.model({
        name: "",
        url: "",
      }),
    ),
    game_indices: types.array(
      types.model({
        game_index: 0,
        version: types.model({
          name: "",
          url: "",
        }),
      }),
    ),
    height: 0,
    id: 0,
    is_default: false,
    location_area_encounters: "",
    moves: types.array(
      types.model({
        move: types.model({
          name: "",
          url: "",
        }),
      }),
    ),
    name: "",
    order: 0,
    species: types.model({
      name: "",
      url: "",
    }),
    sprites: types.model({
      back_default: "",
      front_default: "",
    }),
    stats: types.array(
      types.model({
        base_stat: 0,
        effort: 0,
        stat: types.model({
          name: "",
          url: "",
        }),
      }),
    ),
    types: types.array(
      types.model({
        slot: 0,
        type: types.model({
          name: "",
          url: "",
        }),
      }),
    ),
    weight: 0,
  })
  .actions(withSetPropAction)

export interface PokemonDetails extends Instance<typeof PokemonDetailsModel> {}
export interface PokemonDetailsSnapshotOut extends SnapshotOut<typeof PokemonDetailsModel> {}
export interface PokemonDetailsSnapshotIn extends SnapshotIn<typeof PokemonDetailsModel> {}
