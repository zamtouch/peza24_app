import React, { useState, useRef } from "react";
import { Text, View, Image } from 'react-native';
import { Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import Loader from "./inc/Loader";

global.width = Dimensions.get('window').width;
global.height = Dimensions.get('window').height;

export default function ProfilePage() {

  const [loader, setLoader] = useState(true);

  return (
<View style={{ flex:1 }}>
{loader? <Loader /> : null }
<WebView
      style={{ flex:1 }}
      onLoad={() => setLoader(false) }
      source={{ uri: global.profile_url }}
    />
</View>
  );
}
