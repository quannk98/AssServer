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
    ToastAndroid



} from 'react-native';
import CheckBox from 'react-native-check-box';
import AsyncStorage from '@react-native-async-storage/async-storage';


function Cart() {
    const [checkedItems, setCheckedItems] = useState({});
    const [initialPrice] = useState(300);
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(initialPrice);


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
    function calculateTotalPrice(checkedItems) {
        let totalPrice = 0;

        for (const itemId in checkedItems) {
            if (checkedItems[itemId]) {
                // Tìm sản phẩm trong danh sách dựa vào itemId và tính toán tổng giá
                const selectedItem = dataItem_LVcart.find(item => item.id === itemId);
                if (selectedItem) {
                    const itemPrice = parseInt(selectedItem.price.replace('$', ''));
                    totalPrice += itemPrice;
                }
            }
        }

        return totalPrice;
    }
    return (
        <View>
            <FlatList
                data={dataItem_LVcart}
                style={{ width: "100%", height: 640 }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item: dataCart }) => {

                    return (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <CheckBox
                                style={{ marginStart: 10 }}
                                isChecked={checkedItems[dataCart.id] || false}
                                onClick={() => {

                                    setCheckedItems((prevState) => ({
                                        ...prevState,
                                        [dataCart.id]: !prevState[dataCart.id],
                                    }));
                                }}
                            />

                            <View style={styles.container}>
                                <Image source={{ uri: dataCart.image }} style={styles.image} />
                                <View style={{ marginStart: 20, width: 160, height: "100%" }}>
                                    <Text style={styles.name}>{dataCart.name}</Text>
                                    <Text style={styles.price}>Price: {price}$</Text>
                                    <View style={{ flexDirection: "row" }}>
                                        <View style={{ flexDirection: "row", marginTop: 18 }}>
                                            <TouchableOpacity onPress={decreaseQuantity}>
                                                <Image source={require("E:/React Native/AssignmentAndroidServer/Img/icon_minus-removebg-preview.png")} style={styles.quantity} />
                                            </TouchableOpacity>
                                            <View style={{ width: 100, height: 30, borderWidth: 2, justifyContent: "center", alignItems: "center", marginBottom: 5 }}>
                                                <Text style={{ fontSize: 20, fontWeight: "bold" }}>{quantity}</Text>
                                            </View>
                                            <TouchableOpacity onPress={increaseQuantity}>
                                                <Image source={require("E:/React Native/AssignmentAndroidServer/Img/icon_plus-removebg-preview.png")} style={styles.quantitys} />
                                            </TouchableOpacity>
                                        </View>

                                    </View >
                                </View>
                                <TouchableOpacity>
                                    <Image source={require("E:/React Native/AssignmentAndroidServer/Img/xRed-removebg-preview.png")} style={{ width: 30, height: 30 }} />
                                </TouchableOpacity>

                            </View>
                        </View>

                    );
                }}
            />
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", height: 100, backgroundColor: "white", borderRadius: 10, margin: 5, paddingStart: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "green", width: 180 }}>Total:{calculateTotalPrice(checkedItems)}$</Text>
                <View style={{ alignItems: 'center', paddingLeft: 10 }}>
                    <TouchableOpacity  >
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
        flex: 1,
        backgroundColor: "white",
        borderWidth: 2,
        flexDirection: "row",
        padding: 10,
        margin: 20,
        marginStart: 20,
        borderRadius: 10

    },

    image: {
        width: 100,
        height: 100,
        borderRadius: 10
    },
    name: {
        fontSize: 20,
        fontWeight: "bold"
    },
    price: {
        fontSize: 15,
        fontWeight: "bold",
        color: "green",
    },
    quantity: {
        width: 20,
        height: 20,
        marginRight: 10,
        marginTop: 5
    },
    quantitys: {
        width: 20,
        height: 20,
        marginRight: 10,
        marginLeft: 10,
        marginTop: 5
    },



});
const dataItem_LVcart =
    [
        {
            "id": "1",
            "color": "đỏ",
            "price": "300$",
            "type": "loai 1",
            "image": "https://i1-vnexpress.vnecdn.net/2023/02/02/328463889-891024988600042-6177-9136-2603-1675295134.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=BCVEDMn0Smx1XLiCRi0rrA",
            "name": "Putin",
            "createdAt": "2023-01-12T06:26:17.539Z",
            "createdBy": {
                "_id": "63ac39aeedf7c80016c57a67",
                "name": "",
                "avatar": ""

            }
        },
        {
            "id": "2",
            "color": "vàng",
            "price": "200$",
            "type": "loai 2",
            "image": "https://i1-vnexpress.vnecdn.net/2023/01/31/117f5804708184dfdd90-162556098-1999-1999-1675148782.jpg?w=300&h=180&q=100&dpr=1&fit=crop&s=Ie6cEqbs1YL8PDAG85QrsA",
            "name": "Zelensky",
            "createdAt": "2023-01-12T06:26:17.539Z",
            "createdBy": {
                "_id": "63ac39aeedf7c80016c57a67",
                "name": "",
                "avatar": ""
            }
        },
        {
            "id": "3",
            "title": "xanh",
            "name": "Obama",
            "price": "100$",
            "type": "loai 3",
            "image": "https://i1-vnexpress.vnecdn.net/2023/01/31/giao-vien3-7193-1674696213-167-6044-9285-1675150549.jpg?w=300&h=180&q=100&dpr=1&fit=crop&s=GJm7EfgbBZ4Pvlut0Bl1rw",
            "createdAt": "2023-01-12T06:26:17.539Z",
            "createdBy": {
                "_id": "63ac39aeedf7c80016c57a67",
                "name": "",
                "avatar": ""
            }
        },
    ]


export default Cart;
