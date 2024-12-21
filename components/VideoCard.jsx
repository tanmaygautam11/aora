import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";

const VideoCard = ({
  video: { title, thumbnail, video, creator: { username, avatar }, $id },
  bookmarked,
  onBookmarkToggle,
  showDeleteIcon,
  onDelete
}) => {
  const [play, setPlay] = useState(false);
  const [resizeMode, setResizeMode] = useState(ResizeMode.COVER);

  const unlockOrientation = async () => {
    await ScreenOrientation.unlockAsync();
  };

  useEffect(() => {
    unlockOrientation();
  }, []);

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>
              {username}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => onBookmarkToggle($id)} className="pt-2">
          <Image
            source={bookmarked ? icons.bookmarked : icons.bookmark}
            className="w-5 h-5"
            resizeMode="contain"
          />
        </TouchableOpacity>

        {showDeleteIcon && (
          <TouchableOpacity onPress={() => onDelete(video.$id)} className=" top-2">
            <Image source={icons.del} className="w-5 h-5" />
          </TouchableOpacity>
        )}
      </View>

      {play ? (
        <View className="w-full h-60 rounded-xl mt-3">
          <Video
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
            source={{ uri: video }}
            resizeMode={resizeMode}
            useNativeControls
            shouldPlay
            onFullscreenUpdate={({ fullscreenUpdate }) => {
              if (fullscreenUpdate === 1) {
                setResizeMode(ResizeMode.CONTAIN);
              } else if (fullscreenUpdate === 3) {
                setResizeMode(ResizeMode.COVER);
              }
            }}
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                setPlay(false);
              }
            }}
          />
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
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
