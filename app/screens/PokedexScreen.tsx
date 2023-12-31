import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { ActivityIndicator, FlatList, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { AutoImage, Card, EmptyState, Screen, Text, TextField } from "../components"
import { isRTL } from "../i18n"
import { useStores } from "../models"
import { PokemonEntry } from "../models/PokemonEntry"
import { TabScreenProps } from "../navigators/Navigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"

const ScreenContainer = ({ children }) => (
  <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContentContainer}>
    {children}
  </Screen>
)

export const PokedexScreen: FC<TabScreenProps<"Pokedex">> = observer(function PokedexScreen(
  _props,
) {
  const { pokemonStore } = useStores()

  const [refreshing, setRefreshing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const dataLoaded = pokemonStore.pokedex && !isLoading

  // initially, kick off a background refresh without the refreshing UI
  useEffect(() => {
    ;(async function load() {
      setIsLoading(true)
      await pokemonStore.fetchPokedex()
      setIsLoading(false)
    })()
  }, [pokemonStore])

  // simulate a longer refresh, if the refresh is too fast for UX
  async function manualRefresh() {
    setRefreshing(true)
    await Promise.all([pokemonStore.fetchPokedex(), delay(750)])
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

  const filteredPokedex = pokemonStore.pokedex.filter((pokemon) =>
    pokemon.pokemon_species.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <ScreenContainer>
      <TextField onChangeText={setSearch} value={search} placeholder="Search" />
      <FlatList<PokemonEntry>
        data={filteredPokedex}
        extraData={filteredPokedex.length}
        contentContainerStyle={$flatListContentContainer}
        refreshing={refreshing}
        onRefresh={manualRefresh}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator />
          ) : (
            <EmptyState
              preset="generic"
              style={$emptyState}
              headingTx={"emptyStateComponent.generic.heading"}
              contentTx={"emptyStateComponent.generic.content"}
              button={null}
              buttonOnPress={manualRefresh}
              imageStyle={$emptyStateImage}
              ImageProps={{ resizeMode: "contain" }}
            />
          )
        }
        ListHeaderComponent={
          <View style={$heading}>
            <Text preset="heading" tx="pokedexScreen.title" />
          </View>
        }
        renderItem={({ item }) => (
          <PokemonCard
            key={item.entry_number}
            pokemon={item}
            image={pokemonStore.pokemonImage(item.entry_number)}
            handlePressCard={() => {
              pokemonStore.setSelectedPokemon(item.entry_number)
              _props.navigation.navigate("Pokemon")
            }}
          />
        )}
      />
    </ScreenContainer>
  )
})

const PokemonCard = observer(function EpisodeCard({
  pokemon,
  image,
  handlePressCard,
}: {
  pokemon: PokemonEntry
  image: string
  handlePressCard: () => void
}) {
  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      onPress={handlePressCard}
      HeadingComponent={
        <View style={$metadata}>
          <Text style={$metadataText}>{pokemon.pokemon_species.name}</Text>
        </View>
      }
      content={`#${pokemon.entry_number}`}
      LeftComponent={
        <AutoImage
          source={{
            uri: image,
          }}
        />
      }
    />
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

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

const $heading: ViewStyle = {
  marginBottom: spacing.md,
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

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}
// #endregion
