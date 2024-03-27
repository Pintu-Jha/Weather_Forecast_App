import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Home from './screen/Home/Home'
import FlashMessage from 'react-native-flash-message'
import { textScale } from './styles/responsiveStyles'

const App = () => {
  return (
    <View style={{flex:1}}>
     <Home/>
     <FlashMessage
        position={'top'}
        titleStyle={{
          fontSize:textScale(14)
        }}
      />
    </View>
  )
}

export default App