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
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-lg text-gray-100 font-pmedium">{title}</Text>

      <View
        className={`border-2 w-full h-16 bg-black-100 px-4 rounded-2xl items-center flex-row ${inputBorderColor}`}
        style={props.style}
      >
        <TextInput
          className="text-lg flex-1 text-white font-psemibold"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password"}
          onFocus={customOnFocus}
          onBlur={customOnBlur}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SearchInput;
