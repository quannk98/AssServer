import React, { Component, useEffect, useState } from 'react';
import { View, Text, Button, ImageBackground, Image, TextInput, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const LISTCUSTOMER_API = "http://192.168.56.1:3000/api/signin";

function SignIn({ navigation, route }) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    

    function SignUp() {
        navigation.navigate({
            name: 'SignUp'
        })

    }
    const changeScreen = async () => {
        try {

            const response = await axios.post(LISTCUSTOMER_API, {
                name: name,
                password: password,
                
            });


            if (response.data.success) {

                console.log("Đăng nhập thành công");
                ToastAndroid.show("Đăng nhập thành công", 2)
                await AsyncStorage.setItem('nameCustomer', name);
                setName("")
                setPassword("")
               
                navigation.navigate({
                    name: 'TabBottom'
                });

            } else {
                ToastAndroid.show("Đăng nhập thất bại", 2)
                console.log("Đăng nhập thất bại");

            }
        } catch (error) {
            ToastAndroid.show("Đăng nhập thất bại", 2)


        }
    }



    return (


        <View>
            <ImageBackground source={require("E:/React Native/AssignmentAndroidServer/Img/SignUp.jpg")} style={{ width: "100%", height: "110%" }}>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('E:/React Native/AssignmentAndroidServer/Img/bg1.jpg')}
                        style={{
                            width: '90%',
                            height: 250,
                            margin: 20,
                            borderRadius: 10
                        }}
                    />
                    <Text style={{ fontSize: 25 }}>Chào Mừng Bạn Tới QBuy </Text>
                    <Text style={{ fontSize: 25 }}>Đăng Nhập Và Trải Nghiệm  </Text>
                </View>

                <View style={{ alignItems: 'center' }}>
                    <TextInput style={styles.TextInput}
                        placeholder='Name...'
                        onChangeText={(value) => setName(value)}
                        value={name}

                    />
                    <TextInput style={styles.TextInput}
                        placeholder='Password...'
                        secureTextEntry={true}
                        onChangeText={(value) => setPassword(value)}
                        value={password}
                    />
                </View>


                <View style={{ alignItems: 'center' }}>
                    < TouchableOpacity onPress={() => changeScreen()}>
                        <View style={{ backgroundColor: '#6699FF', width: 250, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                            <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Sign In</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.Text}>
                    <Text style={styles.Text1}>If you do not already have an account ?</Text>
                    <Text style={styles.TextSignin} onPress={() => SignUp()} >Sign Up</Text>
                </View>
                <View style={styles.Img}>

                    <Image
                        style={styles.Img_item}
                        source={require("E:/React Native/AssignmentAndroidServer/Img/icon_insta-removebg-preview.png")}

                    />


                    <Image
                        style={styles.Img_item}
                        source={require("E:/React Native/AssignmentAndroidServer/Img/icon_gg-removebg-preview.png")}

                    />

                    <Image
                        style={styles.Img_item}
                        source={require("E:/React Native/AssignmentAndroidServer/Img/icon_zalo.png")}

                    />



                </View>
            </ImageBackground>
        </View>







    );
}
const styles = StyleSheet.create({

    TextInput: {
        borderRadius: 10,
        borderWidth: 2,
        width: 300,
        height: 40,
        marginTop: 30,
        paddingLeft: 10

    },
    Text: {
        flexDirection: 'row',
        marginLeft: 55


    },
    Text1: {
        marginTop: 20,
        fontSize: 15,

    },
    TextSignin: {
        marginTop: 20,
        marginLeft: 10,
        color: '#6699FF',
        fontSize: 15,
        fontWeight: 'bold'
    },
    Img: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    Img_item: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        width: 80,
        height: 80,


    },

})



export default SignIn;
