import React from 'react';

import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import { Map } from './Map';
import { PlaceList } from './PlaceList';

const Tab = createBottomTabNavigator();
export const TabBar = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === "Mapa") {
                            iconName = "map";
                        } else if (route.name === "Locais") {
                            iconName = "flag";
                        } else if (route.name === "Estátisticas") {
                            iconName = "analytics";
                        } else if (route.name === "Meu Perfil") {
                            iconName = "person";
                        }

                        return <Icon name={iconName!} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: "blue",
                    tabBarInactiveTintColor: "gray",
                })}
            >
                <Tab.Screen name="Mapa" component={Map} />
                <Tab.Screen name="Locais" component={PlaceList} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}



const styles = StyleSheet.create({ tab: { width: "100%", flexDirection: "row" } })