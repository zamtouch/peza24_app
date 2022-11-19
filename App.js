import * as React from 'react';
import { Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import Home from './screens/home';
import Jobs from './screens/jobs';
import Promos from './screens/promos';
import Projects from './screens/projects';
import Podcasts from './screens/podcasts';
import Services from './screens/services';
import ViewProfile from './screens/view_profile';
import Marketplace from './screens/marketplace';
import ProfileMenu from './screens/profile_menu';
import ProfilePage from './screens/profile_page';
import SignUp from './screens/signup';
import OrderService from './screens/order_service';

global.width = Dimensions.get('window').width;
global.height = Dimensions.get('window').height;

function Logo() {
  return (
    <Image
      style={{ width: 90, height: 30 }}
      source={require('./assets/peza24.png')}
    />
  );
}



const Stack = createNativeStackNavigator();

const BottomTab = createBottomTabNavigator();

function MyTabs() {
  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: '#cc0000',
        tabBarActiveBackgroundColor:'#fff',
        tabBarInactiveBackgroundColor:'#fff',
        headerShown:false
      }}>
      <BottomTab.Screen
        name="TabOne"
        component={Home}
        options={() => ({
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={20} />
        })}
      />

<BottomTab.Screen
        name="Jobs"
        component={Jobs}
        options={() => ({
          title: 'Jobs',
          tabBarIcon: ({ color }) => <Ionicons name="briefcase" color={color} size={20} />
  
        })}
      />
      <BottomTab.Screen
        name="Promos"
        component={Promos}
        options={{
          title: 'Sales & Promos',
          tabBarIcon: ({ color }) => <Feather name="shopping-bag" color={color} size={20} />,
        }}
      />

<BottomTab.Screen
        name="Services"
        component={Services}
        options={{
          title: 'Services',
          tabBarIcon: ({ color }) => <Feather name="shopping-cart" color={color} size={20} />,
        }}
      />

<BottomTab.Screen
        name="My Account"
        component={ProfileMenu}
        options={{
          title: 'My Account',
          tabBarIcon: ({ color }) => <Feather name="user" color={color} size={20} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
          <Stack.Navigator>
        <Stack.Screen
          name=" "
          component={MyTabs}
          options={{ headerShown: true, headerTitle: (props) => <Logo {...props} /> }}
        />
        <Stack.Screen name="Projects" component={Projects} />
        <Stack.Screen name="Podcasts" component={Podcasts} />
        <Stack.Screen name="Services" component={Services} />
        <Stack.Screen name="ViewProfile" component={ViewProfile} />
        <Stack.Screen name="OrderService" component={OrderService} />
        <Stack.Screen name="ProfilePage" component={ProfilePage} 
             options={{ headerShown: true, headerTitle: (props) => <Logo {...props} /> }}
        />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
