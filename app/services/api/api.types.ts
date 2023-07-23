/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface Pokemon {
  entry_number: number
  pokemon_species: {
    name: string
    url: string
  }
}

export interface ApiFeedResponse {
  id: number
  name: string
  pokemon_entries: Pokemon[]
}

/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
