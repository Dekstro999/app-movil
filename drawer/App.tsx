import { DefaultTheme, NavigationContainer, NavigatorScreenParams } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import CustomDrawerContent from "./src/components/CustomDrawerContent";
import { Alert, TouchableOpacity } from "react-native";
import Home from "./src/views/Home";
import Demo from "./src/views/Demo";


import { initDatabase } from "./db/initDatabase";
import { createUsuario, getAllUsuarios } from "./db/CRUD-Usuarios";
import { createNota, getAllNotas } from "./db/CRUD-Notas";


import * as ExpoLinking from 'expo-linking';
import { LinkingOptions } from "@react-navigation/native";
import { Provider } from "react-redux";
import { store } from "./src/state/redux/store";
import { useEffect, useState } from "react";

// Deep Linking Configuration
const linking: LinkingOptions<RootDrawerParamList> = {
  prefixes: [ExpoLinking.createURL('/'), 'myapp://'],
  config: {
    screens: {
      Inicio: {
        screens: {
          HomeTabs: {
            screens: {
              Home: 'home',
              ReduxToolkit: 'demo-sqlite',
            },
          },
        },
      },
    },
  },
};


export type HomeTabsParamList = {
  Home: undefined;
  ReduxToolkit: undefined;
  Zustand: undefined;
};

export type MainStackParamList = {
  HomeTabs: NavigatorScreenParams<HomeTabsParamList> | undefined;
};


export type RootDrawerParamList = {
  Inicio: NavigatorScreenParams<MainStackParamList> | undefined;
};


const Tab = createBottomTabNavigator<HomeTabsParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();


function HomeTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#9000d8",
        tabBarInactiveTintColor: "#6b5176",
      }}
    >
      <Tab.Screen name="Home" component={Home} options={{
        title: "Home",
        tabBarIcon: ({ color, size }) => (
          <AntDesign name="home" size={size} color={color} />
        ),
      }}
      />
      <Tab.Screen name="ReduxToolkit" component={Demo} options={{
        title: "Demo SQLite",
        tabBarIcon: ({ color, size }) => (
          <AntDesign name="database" size={size} color={color} />
        ),
      }}
      />



    </Tab.Navigator>
  );
}


function MainStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }: any) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: "#480082",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "700",
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 16 }}
          >
            <MaterialIcons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
        ),
      })}
    >
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabsNavigator}
        options={{ title: " HOME TABS" }}
      />
    </Stack.Navigator>
  );
}


export default function App() {
  


  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase();
        console.log('Base de datos inicializada correctamente');
      } catch (error) {
        console.error('Error al inicializar la base de datos', error);
      }
    };

    initialize();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer
        linking={linking}
        fallback={<Home />}
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: "#f8f8f8",
          },
        }}>
        <Drawer.Navigator
          initialRouteName="Inicio"
          drawerContent={(props: any) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            drawerActiveTintColor: "#380f76",
          }}>
          <Drawer.Screen
            name="Inicio"
            component={MainStackNavigator}
            options={{ title: "Navegación Principal" }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
}