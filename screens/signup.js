import * as React from 'react';
import { Text, View, Image } from 'react-native';
import { Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

global.width = Dimensions.get('window').width;
global.height = Dimensions.get('window').height;

export default function SignUp() {
  return (
<View style={{ flex:1 }}>
<WebView
      style={{ flex:1 }}
      source={{ uri: global.sign_up_url }}
    />
</View>
  );
}
