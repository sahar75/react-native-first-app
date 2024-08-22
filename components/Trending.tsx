import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Text,
  ViewToken,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Models } from "react-native-appwrite";
import { TouchableOpacity } from "react-native-gesture-handler";

interface ITrendingProps {
  posts: Models.Document[];
}

const zoomIn = {
  0: {
    scale: 0.8,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.8,
  },
};

const TrendingItem = (props: { activeItem: string; item: Models.Document }) => {
  const [play, setPlay] = useState(false);

  return (
    <Animatable.View
      className="me-5"
      animation={props.activeItem === props.item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: props.item.video }}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded) setPlay(false);
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: props.item.thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending: React.FC<ITrendingProps> = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[1]?.$id);

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken<Models.Document>[];
  }) => {
    if (viewableItems.length > 0) setActiveItem(viewableItems[0]?.key);
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item?.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      contentOffset={{ x: 170, y: 0 }}
      horizontal
    />
  );
};

export default Trending;
