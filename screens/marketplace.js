import * as React from 'react';
import { Text, View, Image } from 'react-native';

import { Dimensions } from 'react-native';


global.width = Dimensions.get('window').width;
global.height = Dimensions.get('window').height;

export default function Marketplace() {
  return (
<View style={{ justifyContent:'center', alignItems:'center', flex:1 }}>
<Text>Coming soon</Text>
</View>
  );
}
