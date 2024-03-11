import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, TextInput, StyleSheet, ToastAndroid } from 'react-native';
import axios from 'axios';
const LISTCUSTOMER_API = "http://192.168.0.101:3000/api/listcustomer";
function SignUp({ navigation }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [money, setMoney] = useState(0);




    const Accept = async () => {
        if (name === "" || password === "" || address === "" || phone === "") {
            ToastAndroid.show("Không được để trống", 2);
            return;
        }

        else {
            try {

                const response = await axios.post(LISTCUSTOMER_API, {
                    name,
                    phone,
                    password,
                    address,
                    money
                });


                if (response.data.success) {
                    ToastAndroid.show("Đăng ký thành công", 2);
                    navigation.navigate("SignIn");
                } else {
                    ToastAndroid.show("Đăng ký không thành công", 2);
                }
            } catch (error) {
                console.error("Error during sign up:", error);
                ToastAndroid.show("Đã xảy ra lỗi", 2);
            }
        }
    };
    return (
        <View>
            <ImageBackground source={require('E:/React Native/AssignmentAndroidServer/Img/SignUp.jpg')} style={{ width: "100%", height: "110%" }}>
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

                    <View style={{ alignItems: 'center' }}>
                        <TextInput style={styles.TextInput}
                            placeholder='Name...'
                            onChangeText={(value) => setName(value)}
                            value={name}
                        />
                        <TextInput style={styles.TextInput}
                            placeholder='Phone Number...'
                            onChangeText={(value) => setPhone(value)}
                            value={phone}
                        />
                        <TextInput style={styles.TextInput}
                            placeholder='Password...'
                            secureTextEntry={true}
                            onChangeText={(value) => setPassword(value)}
                            value={password}
                        />
                        <TextInput style={styles.TextInput}
                            placeholder='Address...'

                            onChangeText={(value) => setAddress(value)}
                            value={address}
                        />

                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={Accept}>
                            <View style={styles.SignInButton}>
                                <Text style={styles.SignInText}>Sign Up</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                 
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
    SignInButton: {
        backgroundColor: '#6699FF',
        width: 250,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    SignInText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
});


export default SignUp;
