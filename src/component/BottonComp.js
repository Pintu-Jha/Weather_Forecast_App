import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import colors from '../styles/colors';
import { spacing } from '../styles/spacing';
import { textScale } from '../styles/responsiveStyles';

const BottonComp = ({
  onPress = () => {},
  text = '',
  style = {},
  textStyle = {},
  isLoading=false
}) => {
  return (
    <TouchableOpacity style={{...styles.container, ...style}} onPress={onPress} activeOpacity={0.6}>
      {isLoading ? <ActivityIndicator size={'small'} color={'white'} />: <Text style={{...styles.textStyle, ...textStyle}}>{text}</Text>}
    </TouchableOpacity>
  );
};

export default BottonComp;

const styles = StyleSheet.create({
  container: {
    borderRadius: spacing.RADIUS_12,
    alignItems: 'center',
    backgroundColor:'#4B4B4C',
    padding:spacing.PADDING_12,
    marginTop:spacing.MARGIN_10
  },
  textStyle: {
    color: colors.whiteColor,
    fontSize: textScale(14),
  },
});
