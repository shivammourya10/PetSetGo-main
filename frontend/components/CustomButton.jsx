import { TouchableOpacity,Text } from 'react-native'
import React from 'react'

const CustomButton = ({title,handlePress,containerStyles,textStyles,isLoading}) => {
  return (
    <TouchableOpacity 
      onPress = {handlePress}
      activeOpacity = {0.7}
      className={`bg-[#4DB6AC] rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`} disabled={isLoading}>
        <Text className={`text-white font-psemibold  text-md ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton