import React, { Component, useState, useEffect } from 'react';
import {
    View, Text, SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    FlatList,
    Dimensions,
    TextInput,
    Image,
    TouchableOpacity,
    useWindowDimensions,
    ToastAndroid,
    route
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const API = "http://192.168.0.101:3000/api/customer/"
const API_history = "http://192.168.0.101:3000/api/buyhistory"
const API_cart = "http://192.168.0.101:3000/api/cart"
function BuyProduct({ navigation, route }) {
    const [initialPrice, setInitalPrice] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(initialPrice);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [userData, setUserData] = useState(null);
    const [money, setMoney] = useState();
    const { productData } = route?.params;


    const loadNameFromStorage = async () => {
        try {
            const nameFromStorage = await AsyncStorage.getItem('nameCustomer');
            setName(nameFromStorage);
            setInitalPrice(productData.price)
            setPrice(productData.price)
        } catch (error) {
            console.error('Error loading name from AsyncStorage:', error);
        }
    };

    const loadCustomerDataFromServer = async () => {

        try {
            const response = await axios.get(API + name);

            if (response.status === 200) {
                const customerData = response.data.customer;
                setPhone(customerData.phone);
                setAddress(customerData.address)
                setMoney(customerData.money)
                console.log("phonew la" + phone)
            } else {
                console.error('Error fetching customer data:', response.data.message);
            }
        } catch (error) {
            // console.error('Error loading user data from server:', error);
        }
    };

    useEffect(() => {
        loadNameFromStorage();
    }, []);
    useEffect(() => {
        loadCustomerDataFromServer();
    }, [name]);
    const increaseQuantity = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        setPrice(initialPrice * newQuantity);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            setPrice(initialPrice * newQuantity);
        } else {
            ToastAndroid.show("Không thể giảm được số lượng sản phẩm", 2);
        }
    };
    const Buy = async () => {
        try {
            if (money < price) {

                ToastAndroid.show("Số dư không đủ! Hãy nạp thêm tiền để mua sản phẩm", 2);
                return;
            }

            if (productData.quantity < quantity) {

                ToastAndroid.show("Số lượng sản phẩm hiện tại không đủ", 2);
                return;
            }

            const response = await axios.post(API_history, {
                name: productData.name,
                total: price,
                quantity: quantity,
                buyer: name,
                phone: phone,
                address: address,
                images: productData.images


            });

            if (response.data.success) {
                ToastAndroid.show("Mua Hàng Thành Công", 2);
                navigation.navigate("TabBottom");
            }

            else {
                console.error('Error buying product:', response.data.message);
                ToastAndroid.show("Đã xảy ra lỗi khi mua hàng", 2);
            }
        }
        catch (error) {
            console.error('Error buying product:', error);
            ToastAndroid.show("Đã xảy ra lỗi khi mua hàng", 2);
        }


    }
    const AddCart = async () => {
        const nameFromStorage = await AsyncStorage.getItem('nameCustomer');
        console.log("asdad" + nameFromStorage)
        try {
            const response = await axios.post(API_cart, {
                id_product: productData._id,
                name_customer: nameFromStorage,
                name_product: productData.name,
                price: productData.price,
                color: productData.color,
                type: productData.type,
                images: productData.images,
                quantity: 1,
                quantity_product: productData.quantity
    
            })
            if (response.data.success) {
                ToastAndroid.show("Thêm Vào Giở Hàng Thành Công", 2);
                navigation.navigate("TabBottom");
            }
            else {
                console.error('Error buying product:', error);
                ToastAndroid.show("Lỗi thêm vào giỏ hàng", 2);
            } 
        } catch (error) {
            ToastAndroid.show("Sản phẩm đã có trong giỏ hàng", 2);
        }
      
    }
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20 }}>PRODUCT</Text>
            <FlatList
                data={productData.images.slice(0, 2)}
                keyExtractor={(image, index) => index.toString()}
                horizontal
                style={{ width: 280, height: 300 }}
                renderItem={({ item: image }) => (
                    <Image
                        source={{ uri: `http://192.168.0.101:3000/Image/${image}` }}
                        style={[styles.images]}
                    />
                )}
            />
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.name}>{productData.name}</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 30, marginStart: 30 }}>({productData.quantity})</Text>
            </View>


            <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "row", marginTop: 18 }}>
                    <TouchableOpacity onPress={decreaseQuantity}>
                        <Image source={require("E:/React Native/AssignmentAndroidServer/Img/icon_minus-removebg-preview.png")} style={styles.quantity} />
                    </TouchableOpacity>
                    <View style={{ width: 100, height: 30, borderWidth: 2, justifyContent: "center", alignItems: "center", marginBottom: 5 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{quantity}</Text>
                    </View>
                    <TouchableOpacity onPress={increaseQuantity}>
                        <Image source={require("E:/React Native/AssignmentAndroidServer/Img/icon_plus-removebg-preview.png")} style={styles.quantity} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.price}>Price:{price}$</Text>
            </View >
            <View style={styles.profile}>
                <Text style={styles.textprofile}>Buyer: {name}</Text>
            </View >
            <View style={styles.profile}>
                <Text style={styles.textprofile}>Address: {address}</Text>
            </View>
            <View style={styles.profile}>
                <Text style={styles.textprofile}>Phone Number: {phone}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <TouchableOpacity onPress={() => AddCart()} >
                        <View style={{ backgroundColor: '#6699FF', width: 180, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>ADD CART</Text>
                        </View>

                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', marginTop: 20, paddingLeft: 10 }}>
                    <TouchableOpacity onPress={() => Buy()} >
                        <View style={{ backgroundColor: '#6699FF', width: 180, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>BUY</Text>
                        </View>

                    </TouchableOpacity>
                </View>

            </View>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginTop: 20,
        backgroundColor: '#EEEEEE'
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 10
    },
    images: {
        width: 280,
        height: 300,
        borderRadius: 10,
    },
    name: {
        fontSize: 40,
        fontWeight: "bold",
        color: "red",
        marginTop: 10,
        marginStart: 80
    },
    price: {
        fontSize: 30,
        fontWeight: "bold",
        color: "green",
        marginTop: 10,
        marginStart: 10
    },
    color: {
        fontSize: 30,
        fontWeight: "bold",
        color: "blue",
        marginTop: 10
    },
    type: {
        fontSize: 30,
        fontWeight: "bold",

        marginTop: 10
    },
    quantity: {
        width: 20,
        height: 20,
        marginRight: 10,
        marginLeft: 10,
        marginTop: 5
    },
    profile: {
        width: 350,
        height: 40,
        borderWidth: 3,
        borderRadius: 5,
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 10
    },
    textprofile: {
        fontSize: 15,
        fontWeight: "bold"
    }
})


export default BuyProduct;
