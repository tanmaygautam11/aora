import { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, signOut, deleteVideo } from "../../lib/appwrite"; // Import deleteVideo function
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import InfoBox from "../../components/InfoBox";
import { router } from "expo-router";
import { toggleBookmark } from "../../lib/appwrite";

const Profile = () => {
  const { user, setUser, setIsLoggedIn, bookmarkedPosts, toggleBookmarkInGlobalState } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace('/sign-in');
  };

  const handleBookmarkToggle = async (postId) => {
    try {
      const updatedPost = await toggleBookmark(postId, user?.$id);
      const isBookmarked = updatedPost.bookmark !== null;
      toggleBookmarkInGlobalState(postId, isBookmarked);
    } catch (error) {
      console.error("Failed to toggle bookmark:", error.message);
    }
  };

  // Handle video deletion
  const handleDelete = async (videoId) => {
    try {
      const response = await deleteVideo(videoId);
      if (response.success) {
        Alert.alert('Success', 'Video deleted successfully!');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete the video.');
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
            bookmarked={bookmarkedPosts[item.$id] ?? false}
            onBookmarkToggle={handleBookmarkToggle}
            showDeleteIcon={true} // Ensure delete icon is shown in the profile page
            onDelete={() => handleDelete(item.$id)}  // Pass delete function to VideoCard
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity className="w-full items-end mb-10" onPress={logout}>
              <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
              <Image source={{ uri: user?.avatar }} className="w-[90%] h-[90%] rounded-lg" resizeMode="cover" />
            </View>

            <InfoBox 
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex-row">
              <InfoBox 
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles="mr-10"
                titleStyles="text-xl"
              />
              <InfoBox 
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
