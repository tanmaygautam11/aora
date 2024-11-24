import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";

import { icons } from "../constants";

const SearchInput = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
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
          value={value}
          placeholder="Search for a video topic"
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password"}
          onFocus={customOnFocus}
          onBlur={customOnBlur}
          {...props}
        />

        <TouchableOpacity>
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
