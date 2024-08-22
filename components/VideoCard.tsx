import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Models } from "react-native-appwrite";
import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";

interface IVideoCardProps {
  video: Models.Document;
}

const VideoCard: React.FC<IVideoCardProps> = ({ video }) => {
  const [play, setPlay] = useState(false);

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row items-start">
        <View className="justify-center items-center flex-row  gap-3 flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: video?.creator?.avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="contain"
            />
          </View>
          <View className="justify-center flex-1 ms-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {video?.title}
            </Text>
            <Text
              className="text-start text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {video?.creator?.username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>
      {play ? (
        <Video
          source={{ uri: video.video }}
          className="w-full h-60 rounded-xl"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded) setPlay(false);
          }}
        />
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: video?.thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="contain"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
