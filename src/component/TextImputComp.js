import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { spacing } from '../styles/spacing'
import { textScale } from '../styles/responsiveStyles'
import colors from '../styles/colors'

const TextImputComp = ({
    inputStyle={},
    value='',
    onChangeText,
    placeholder='',
    placeholderTextColor = "#fff",
    RightImg = null,
    ...props
}) => {
  return (
    <View style={{...styles.inputStyle,...inputStyle}}>
     {!!RightImg ? <Image source={RightImg} style={{width:spacing.WIDTH_30,height:spacing.HEIGHT_30}} /> : <View />}
      <TextInput
        style={{...styles.textStyle}}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        {...props}
      />
    </View>
  )
}

export default TextImputComp

const styles = StyleSheet.create({
    inputStyle:{
        height:spacing.HEIGHT_52,
        borderRadius:spacing.RADIUS_20,
        flexDirection:"row",
        justifyContent:"space-between",
        paddingHorizontal:spacing.PADDING_16,
        alignItems:"center",
        backgroundColor:"#8AC1F8",
        marginBottom:spacing.MARGIN_16
    },
    textStyle:{
        fontSize:textScale(14),
        flex:1,
        color:"#E7EDF4",
    }
})