import React, { useState, useRef } from "react";
import { Text, View, Image } from 'react-native';
import { Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import Loader from "./inc/Loader";
global.width = Dimensions.get('window').width;
global.height = Dimensions.get('window').height;

export default function SignUp() {

  const [ visible, setVisible ] = useState(true);
  return (
<View style={{ flex:1 }}>
<WebView
      style={{ flex:1 }}
      onLoad={() => setVisible(false)}
      source={{ uri: 'https://app.peza24.com/mobile/reset-pw.php' }}
    />
         {visible ? <Loader /> : null}
</View>
  );
}
