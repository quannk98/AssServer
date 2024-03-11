import React, { Component, useEffect, useState } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Button, ToastAndroid } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';



const API = "http://192.168.0.101:3000/api/customer/"
const API_FAVORITE = "http://192.168.0.101:3000/api/favorite/"
// const API_DELETEFA = "http://192.168.0.101:3000/api/favoritedelete/"

function Profile({ navigation }) {
    const [name, setName] = useState('');
    const [money, setMoney] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [amount, setAmount] = useState('');
    const [dataFa, setDataFa] = useState()
    useEffect(() => {
        const loadData = async () => {
            const nameFromStorage = await AsyncStorage.getItem('nameCustomer');
            setName(nameFromStorage);

            const response = await axios.get(API + nameFromStorage);

            if (response.status === 200) {
                const customerData = response.data.customer;
                setMoney(parseFloat(customerData.money));
            } else {
                console.error('Error fetching customer data:', response.data.message);
            }

            const responseFa = await axios.get(API_FAVORITE + nameFromStorage);

            if (responseFa.status === 200) {
                setDataFa(responseFa.data);
            } else {
                console.error('Error fetching favorite data:', responseFa.data.message);
            }
        };

        const interval = setInterval(() => {
            loadData();
        }, 1000);

        loadData();

        return () => clearInterval(interval);
    }, []);

    function ClickLogout() {
        navigation.navigate('SignIn')
    }
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const handlePayment = async () => {
        if (!amount || !money) {
            console.error('Error handling payment: amount or money is null or undefined');
            return;
        }

        try {
            const response = await axios.put(API + name, {
                money: parseFloat(money) + parseFloat(amount),
            });

            if (response.data.success) {
                setMoney(parseFloat(money) + parseFloat(amount));
                setAmount('');
            } else {
                console.error('Error updating customer data:', response.data.message);
            }

            toggleModal();
        } catch (error) {
            console.error('Error handling payment:', error);
        }
    };


    return (
        <View style={{ width: '100%', height: 740 }}>
            <ScrollView>
                <View style={{ backgroundColor: '#EEEEEE', }}>
                    <ImageBackground source={require('E:/React Native/AssignmentAndroidServer/Img/zelensky.jpg')} style={{ width: '100%', height: 200 }}>
                        <View style={styles.stylename}>

                            <View >
                                <Image style={styles.imgavtar} source={require('E:/React Native/AssignmentAndroidServer/Img/putin.jpg')}
                                />

                            </View>


                        </View>

                        <View style={{ width: 180, alignItems: 'center', flexDirection: "row", marginStart: 60 }}>
                            <Text style={styles.textname}>{name}</Text>
                            <Image source={require("E:/React Native/AssignmentAndroidServer/Img/vidientu-removebg-preview.png")} style={{ width: 30, height: 30, marginTop: 5, marginStart: 20 }} />
                            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 5, marginStart: 5 }}>{money}$</Text>

                        </View>





                    </ImageBackground>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 80 }}>
                        < TouchableOpacity onPress={() => toggleModal()} >
                            <View style={{ backgroundColor: '#6699FF', width: 320, height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 15, marginLeft: 18 }}>
                                <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Nạp Tiền Vào Ví</Text>

                            </View>
                        </TouchableOpacity>
                        <View>
                            <TouchableOpacity onPress={() => ClickLogout()}>
                                <Image style={{ width: 80, height: 80 }} source={require('E:/React Native/AssignmentAndroidServer/Img/icon_dangxuat-removebg-preview.png')} />
                            </TouchableOpacity>
                        </View>


                    </View>

                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => {
                        toggleModal();
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Chọn Phương Thức Thanh Toán</Text>

                            <RNPickerSelect
                                onValueChange={(value) => setSelectedPaymentMethod(value)}
                                items={[
                                    { label: 'Tiền mặt', value: 'Tiền mặt' },
                                    { label: 'ZaloPay', value: 'ZaloPay' },
                                ]}
                            />

                            <TextInput
                                style={styles.amountInput}
                                placeholder="Nhập số tiền"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={(text) => setAmount(text)}
                            />

                            <Button title="Nạp Tiền" onPress={() => handlePayment()} />

                            <Button title="Đóng" onPress={() => toggleModal()} />
                        </View>
                    </View>
                </Modal>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <View>
                        <Text style={{ fontSize: 25, fontWeight: "bold", marginTop: 10 }}>DANH SÁCH YÊU THÍCH</Text>
                    </View>

                    <View style={{ backgroundColor: "#FFF", width: "90%", height: 320, borderRadius: 10, marginTop: 10 }}>
                        <ScrollView>
                            {dataFa && dataFa.map((item, index) => (
                                <View key={index} style={[styles.container, {
                                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: "#EEEEEE", padding: 10,
                                    borderRadius: 20
                                }]}>
                                    <Image source={{
                                        uri: `http://192.168.0.101:3000/Image/${item.img_product}`,
                                    }} style={{ width: 80, height: 100, borderRadius: 10,backgroundColor:"white",padding:10 }} />
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold', marginStart: 20 }}>{item.name_product}</Text>

                                    </View>
                                </View>
                            ))}
                        </ScrollView>

                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        borderRadius: 10
    },
    stylename: {
        marginTop: 130,

    },

    imgavtar: {
        width: 110,
        height: 110,
        borderRadius: 80,
        marginStart: 35,
        marginEnd: 10,

    },


    textname: {
        width: 200,
        fontSize: 30,
        fontWeight: "bold"
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    paymentMethodText: {
        fontSize: 18,
        marginBottom: 10,
        color: 'blue',
    },
    amountInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        height: 40,
        marginBottom: 20,
    }

})


export default Profile;
