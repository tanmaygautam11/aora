import { View, Text, FlatList, Image, RefreshControl, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

import { images } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getUserBookmarkedPosts, toggleBookmark } from "../../lib/appwrite";

const Bookmark = () => {
  const { user, bookmarkedPosts, toggleBookmarkInGlobalState } = useGlobalContext();
  const { data: posts, loading, refetch } = useAppwrite(() =>
    getUserBookmarkedPosts(user?.$id)
  );

  const [refreshing, setRefreshing] = useState(false);

  // Show the alert every time the page is focused
  useFocusEffect(
    React.useCallback(() => {
      setRefreshing(true);
      refetch();
      setRefreshing(false);
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleBookmarkToggle = async (postId) => {
    try {
      const updatedPost = await toggleBookmark(postId, user?.$id);
      const isBookmarked = updatedPost.bookmark !== null;
      toggleBookmarkInGlobalState(postId, isBookmarked); // Update global state
      await refetch(); // Refetch the list to reflect changes
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary h-full justify-center items-center">
        <Text className="text-white font-pmedium text-base">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            bookmarked={true} // Mark as bookmarked since it's a bookmarked list
            onBookmarkToggle={handleBookmarkToggle} // Pass the toggle function
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="text-3xl font-psemibold text-white">
                  Bookmarked Videos
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
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Bookmarked Videos"
            subtitle="You haven't bookmarked any videos yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Bookmark;
