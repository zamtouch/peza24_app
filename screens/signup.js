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
  onLoad={() => setVisible(false)}
      style={{ flex:1 }}
      source={{ uri: global.sign_up_url }}
    />
        {visible ? <Loader /> : null}
</View>
  );
}
