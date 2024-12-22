import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, getUserBookmarkedPosts } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [bookmarkedPosts, setBookmarkedPosts] = useState({}); // Track bookmarks

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                if (currentUser) {
                    setIsLoggedIn(true);
                    setUser(currentUser);

                    // Fetch and set initial bookmarked posts
                    const bookmarks = await getUserBookmarkedPosts(currentUser.$id);
                    const bookmarksMap = bookmarks.reduce((acc, post) => {
                        acc[post.$id] = true;
                        return acc;
                    }, {});
                    setBookmarkedPosts(bookmarksMap);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } catch (error) {
                console.error("Error initializing user:", error);
                setIsLoggedIn(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initializeUser();
    }, []);

    const toggleBookmarkInGlobalState = (postId, isBookmarked) => {
        setBookmarkedPosts((prev) => ({
            ...prev,
            [postId]: isBookmarked,
        }));
    };

    return (
        <GlobalContext.Provider 
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
                bookmarkedPosts,
                toggleBookmarkInGlobalState,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
