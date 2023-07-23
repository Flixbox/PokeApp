import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { ActivityIndicator, FlatList, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { AutoImage, Card, EmptyState, Screen, Text } from "../components"
import { isRTL } from "../i18n"
import { useStores } from "../models"
import { PokemonEntry } from "../models/PokemonEntry"
import { TabScreenProps } from "../navigators/Navigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"

export const PokemonScreen: FC<TabScreenProps<"Pokemon">> = observer(function PokemonScreen(
  _props,
) {
  const { pokemonStore } = useStores()

  const { sprites, name } = pokemonStore.selectedPokemonDetails

  const [refreshing, setRefreshing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // initially, kick off a background refresh without the refreshing UI
  useEffect(() => {
    ;(async function load() {
      setIsLoading(true)
      await pokemonStore.fetchSelectedPokemonData(pokemonStore.selectedPokemonId)
      setIsLoading(false)
    })()
  }, [pokemonStore, pokemonStore.selectedPokemonId])

  // simulate a longer refresh, if the refresh is too fast for UX
  async function manualRefresh() {
    setRefreshing(true)
    await Promise.all([
      pokemonStore.fetchSelectedPokemonData(pokemonStore.selectedPokemonId),
      delay(750),
    ])
    setRefreshing(false)
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContentContainer}>
      <Card
        style={$item}
        verticalAlignment="force-footer-bottom"
        HeadingComponent={
          <View style={$metadata}>
            <Text style={$metadataText}>{name}</Text>
          </View>
        }
        content={`#${name}`}
        LeftComponent={
          <AutoImage
            source={{
              uri: sprites.front_default,
            }}
          />
        }
      />
    </Screen>
  )
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $item: ViewStyle = {
  padding: spacing.md,
  marginTop: spacing.md,
  minHeight: 120,
}

const $metadata: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.xs,
  flexDirection: "row",
}

const $metadataText: TextStyle = {
  color: colors.textDim,
  marginEnd: spacing.md,
  marginBottom: spacing.xs,
}
// #endregion
