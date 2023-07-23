// Interested in migrating from FlatList to FlashList? Check out the recipe in our Ignite Cookbook
// https://ignitecookbook.com/docs/recipes/MigratingToFlashList
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo } from "react"
import {
  AccessibilityProps,
  ActivityIndicator,
  FlatList,
  Image,
  ImageStyle,
  Platform,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { AutoImage, Button, Card, EmptyState, Icon, Screen, Text, Toggle } from "../components"
import { isRTL, translate } from "../i18n"
import { useStores } from "../models"
import { PokemonEntry } from "../models/PokemonEntry"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"

const rnrImage1 = require("../../assets/images/rnr-image-1.png")
const rnrImage2 = require("../../assets/images/rnr-image-2.png")
const rnrImage3 = require("../../assets/images/rnr-image-3.png")
const rnrImages = [rnrImage1, rnrImage2, rnrImage3]

export const DemoPodcastListScreen: FC<DemoTabScreenProps<"DemoPodcastList">> = observer(
  function DemoPodcastListScreen(_props) {
    const { pokemonStore } = useStores()

    const [refreshing, setRefreshing] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

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

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$screenContentContainer}
      >
        <FlatList<PokemonEntry>
          data={pokemonStore.pokedex}
          extraData={pokemonStore.pokedex.length}
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
                headingTx={"demoPodcastListScreen.noFavoritesEmptyState.heading"}
                contentTx={"demoPodcastListScreen.noFavoritesEmptyState.content"}
                button={null}
                buttonOnPress={manualRefresh}
                imageStyle={$emptyStateImage}
                ImageProps={{ resizeMode: "contain" }}
              />
            )
          }
          ListHeaderComponent={
            <View style={$heading}>
              <Text preset="heading" tx="demoPodcastListScreen.title" />
            </View>
          }
          renderItem={({ item }) => (
            <PokemonCard
              key={item.entry_number}
              pokemon={item}
              image={pokemonStore.pokemonImage(item.entry_number)}
            />
          )}
        />
      </Screen>
    )
  },
)

const PokemonCard = observer(function EpisodeCard({
  pokemon,
  image,
}: {
  pokemon: PokemonEntry
  image: string
}) {
  const handlePressCard = () => {
    // TODO Detail page
    // openLinkInBrowser(pokemon.entry_number)
  }

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
