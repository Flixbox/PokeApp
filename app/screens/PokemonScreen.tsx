import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { AutoImage, Card, ListItem, Screen, Text } from "../components"
import { useStores } from "../models"
import { TabScreenProps } from "../navigators/Navigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"

const ScreenContainer = ({ children }) => (
  <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContentContainer}>
    {children}
  </Screen>
)

export const PokemonScreen: FC<TabScreenProps<"Pokemon">> = observer(function PokemonScreen(
  _props,
) {
  const { pokemonStore } = useStores()

  const { selectedPokemonDetails } = pokemonStore

  const [refreshing, setRefreshing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const dataLoaded = selectedPokemonDetails && !isLoading

  console.log("selectedPokemonDetails", selectedPokemonDetails)
  console.log("isLoading", isLoading)

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

  if (!dataLoaded) {
    return (
      <ScreenContainer>
        <View style={$activityIndicatorView}>
          <ActivityIndicator size="large" />
        </View>
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={manualRefresh} />}
      >
        <Card
          style={$item}
          verticalAlignment="force-footer-bottom"
          HeadingComponent={
            <View style={$metadata}>
              <Text
                style={$metadataText}
              >{`#${selectedPokemonDetails.id} ${selectedPokemonDetails.name}`}</Text>
            </View>
          }
          FooterComponent={
            <View>
              <ListItem>
                <AutoImage
                  source={{
                    uri: selectedPokemonDetails.sprites.front_default,
                  }}
                />
                <AutoImage
                  source={{
                    uri: selectedPokemonDetails.sprites.back_default,
                  }}
                />
              </ListItem>
              <Text style={$metadataText}>{`Types: ${selectedPokemonDetails.types.map(
                (type) => `${type.type.name}`,
              )}`}</Text>
              <Text style={$metadataText}>{`Abilities: ${selectedPokemonDetails.abilities.map(
                (ability) => `${ability.ability.name}`,
              )}`}</Text>
              <Text style={$metadataText}>{`Weight: ${selectedPokemonDetails.weight}`}</Text>
              <Text style={$metadataText}>{`Height: ${selectedPokemonDetails.height}`}</Text>
              <Text
                style={$metadataText}
              >{`Base experience: ${selectedPokemonDetails.base_experience}`}</Text>

              <Text style={$headingText}>{`Stats:`}</Text>
              {selectedPokemonDetails.stats.map((stat) => (
                <Text
                  key={stat.stat.name}
                  style={$metadataText}
                >{`${stat.stat.name}: ${stat.base_stat}`}</Text>
              ))}

              <Text style={$headingText}>{`Moves:`}</Text>
              {selectedPokemonDetails.moves.map((move) => (
                <Text key={move.move.name} style={$metadataText}>{`${move.move.name}`}</Text>
              ))}
            </View>
          }
        />
      </ScrollView>
    </ScreenContainer>
  )
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $activityIndicatorView: ViewStyle = {
  flex: 1,
  justifyContent: "center",
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

const $headingText: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.md,
  marginBottom: spacing.xs,
}
// #endregion
