import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import { getAllPosts, toggleBookmark, getLatestPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import Trending from "../../components/Trending";
import { useGlobalContext } from "../../context/GlobalProvider";
import Loader from "../../components/Loader";

const Home = () => {
  const { user, bookmarkedPosts, toggleBookmarkInGlobalState } = useGlobalContext();
  const { data: posts, loading, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary h-full justify-center items-center">
        <Loader />
      </SafeAreaView>
    );
  }

  const handleBookmarkToggle = async (postId) => {
    try {
      const updatedPost = await toggleBookmark(postId, user?.$id);
      const isBookmarked = updatedPost.bookmark !== null;
      toggleBookmarkInGlobalState(postId, isBookmarked); // Update global state
    } catch (error) {
      console.error("Failed to toggle bookmark:", error.message);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            bookmarked={bookmarkedPosts[item.$id] ?? false} // Use global bookmark state
            onBookmarkToggle={handleBookmarkToggle}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-base text-gray-100">
                  Welcome Back,
                </Text>
                <Text className="text-3xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Videos
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
