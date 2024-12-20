import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // New state for tracking bookmarked posts
    const [bookmarkedPosts, setBookmarkedPosts] = useState({});

    useEffect(() => {
        getCurrentUser()
            .then(res => {
                if (res) {
                    setIsLoggedIn(true);
                    setUser(res);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            })
            .catch(error => {
                console.log(error);
                setIsLoggedIn(false);
                setUser(null);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // Function to toggle bookmark status in global state
    const toggleBookmarkInGlobalState = (postId, isBookmarked) => {
        setBookmarkedPosts((prev) => ({
            ...prev,
            [postId]: isBookmarked
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
                bookmarkedPosts, // Expose the bookmarkedPosts state
                toggleBookmarkInGlobalState // Function to toggle bookmarks
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export default GlobalProvider;
