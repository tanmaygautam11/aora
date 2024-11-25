import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";

import { icons } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({ initialQuery, ...props }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || '');

  const [inputBorderColor, setInputBorderColor] = useState("border-black-200");

  const customOnFocus = () => {
    setInputBorderColor("border-secondary");
    if (props.onFocus) {
      props.onFocus();
    }
  };

  const customOnBlur = () => {
    setInputBorderColor("border-black-200");
    if (props.onBlur) {
      props.onBlur();
    }
  };

  return (
      <View
        className={`border-2 w-full h-16 bg-black-100 px-4 rounded-2xl items-center flex-row space-x-4 ${inputBorderColor}`}
        style={props.style}
      >
        <TextInput
          className="text-base mt-0.5 flex-1 text-white font-pregular"
          value={query}
          placeholder="Search for a video topic"
          placeholderTextColor="#CDCDE0"
          onChangeText={(e) => setQuery(e)}
          onFocus={customOnFocus}
          onBlur={customOnBlur}
          {...props}
        />

        <TouchableOpacity
          onPress={() => {
            if (!query) {
              return Alert.alert('Missing query', 'Please input something to get results across database')
            }

            if (pathname.startsWith('/search')) router.setParams({ query });
            else router.push(`/search/${query}`);
          }}
        >
          <Image
            source={icons.search}
            className="w-5 h-5"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
  );
};

export default SearchInput;
