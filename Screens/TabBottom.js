import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import Profile from './Profile';
import Oders from './Oders';
import Cart from './Cart';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home_Stack" component={Home} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}
function ProfileStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile_Stack" component={Profile} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}
function OdersStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Oders_Stack" component={Oders} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}
function CartStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Cart_Stack" component={Cart} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

function TabBottom() {

    return (
        <Tab.Navigator
            screenOptions={{

                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',

                    left: 20,
                    right: 20,
                    elevation: 0,
                    backgroundColor: '#ffffff',
                    borderRadius: 15,
                    height: 90,
                    ...styles.shadow
                }
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignContent: 'center', justifyContent: 'center' }}>
                            <Image
                                source={require('E:/React Native/AssignmentAndroidServer/Img/icon_news.png')}
                                resizeMode="contain"
                                style={{
                                    marginLeft: 4,
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? '#e32f45' : '#748c94',
                                }}
                            />
                            <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>
                                HOME
                            </Text>

                        </View>
                    ),
                    headerShown: false,
                }} />
                 <Tab.Screen
                name="Cart"
                component={CartStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignContent: 'center', justifyContent: 'center' }}>
                            <Image
                                source={require('E:/React Native/AssignmentAndroidServer/Img/oders-removebg-preview.png')}
                                resizeMode="contain"
                                style={{
                                    marginLeft: 2,
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? '#e32f45' : '#748c94',
                                }}
                            />
                            <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>
                               CART
                            </Text>

                        </View>
                    ),
                    headerShown: false,
                }} />
            <Tab.Screen
                name="Oders"
                component={OdersStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignContent: 'center', justifyContent: 'center' }}>
                            <Image
                                source={require('E:/React Native/AssignmentAndroidServer/Img/listOrder-removebg-preview.png')}
                                resizeMode="contain"
                                style={{
                                    marginLeft: 10,
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? '#e32f45' : '#748c94',
                                }}
                            />
                            <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>
                                ORDERS
                            </Text>

                        </View>
                    ),
                    headerShown: false,
                }} />
            <Tab.Screen
                name="Profile"
                component={ProfileStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignContent: 'center', justifyContent: 'center' }}>
                            <Image
                                source={require('E:/React Native/AssignmentAndroidServer/Img/icon_profile.png')}
                                resizeMode="contain"
                                style={{
                                    marginLeft: 13,
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? '#e32f45' : '#748c94',
                                }}
                            />
                            <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>
                                PROFILES
                            </Text>

                        </View>
                    ),
                    headerShown: false,
                }} />
        </Tab.Navigator>
    );
}
const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
})


export default TabBottom;
