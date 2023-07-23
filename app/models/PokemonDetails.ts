import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * This represents a detailed Pokemon entry.
 * Some details can be null. This can happen if data is not up-to-date yet. Example: tadbulb's base_experience is null.
 */
export const PokemonDetailsModel = types
  .model("PokemonDetails")
  .props({
    abilities: types.maybeNull(
      types.array(
        types.model({
          ability: types.model({
            name: "",
            url: "",
          }),
          is_hidden: false,
          slot: 0,
        }),
      ),
    ),
    base_experience: types.maybeNull(types.number),
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
    height: types.maybeNull(types.number),
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
    sprites: types.maybeNull(
      types.model({
        back_default: types.maybeNull(types.string),
        front_default: types.maybeNull(types.string),
      }),
    ),
    stats: types.array(
      types.model({
        base_stat: 0,
        effort: 0,
        stat: types.model({
          name: types.maybeNull(types.string),
          url: types.maybeNull(types.string),
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
    weight: types.maybeNull(types.number),
  })
  .actions(withSetPropAction)

export interface PokemonDetails extends Instance<typeof PokemonDetailsModel> {}
export interface PokemonDetailsSnapshotOut extends SnapshotOut<typeof PokemonDetailsModel> {}
export interface PokemonDetailsSnapshotIn extends SnapshotIn<typeof PokemonDetailsModel> {}
