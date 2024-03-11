import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_history = "http://192.168.0.101:3000/api/buyhistory/";

function Orders() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const nameFromStorage = await AsyncStorage.getItem('nameCustomer');


                const response = await axios.get(API_history + nameFromStorage);

                setData(response.data);
                console.log(response.data)
            } catch (error) {
                console.log("Error:", error);
                console.log("Response:", error.response.data);
            }
        };

        fetchData();


        const interval = setInterval(() => {
            fetchData();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View>
            <View style={{ alignItems: "center" }}>
                <Text style={{ marginTop: 10, fontSize: 25, fontWeight: "bold", color: "black" }}>Lịch Sử Mua Hàng</Text>
            </View>
            <FlatList
                data={data}
                keyExtractor={(item, index) => (item && item.id ? item.id.toString() : index.toString())}
                style={{ width: "100%", height: 740 }}
                renderItem={({ item: dataOrder }) => {
                    return (
                        <View style={styles.container}>
                            <Image source={{ uri: `http://192.168.0.101:3000/Image/${dataOrder.images[0]}` }} style={styles.image} />
                            <View style={{ marginStart: 20 }}>
                                <Text style={styles.name}>Product: {dataOrder.name}</Text>
                                <Text style={styles.price}>Total: {dataOrder.total}$</Text>
                                <Text style={styles.price}>Quantity: {dataOrder.quantity}</Text>
                                <Text style={styles.price}>Buyer: {dataOrder.buyer}</Text>
                                <Text style={styles.price}>Address: {dataOrder.address}</Text>
                                <Text style={styles.price}>Phone: {dataOrder.phone}</Text>
                            </View>
                        </View>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        // borderWidth: 2,
        flexDirection: "row",
        padding: 10,
        margin: 20,
        marginStart: 20,
        borderRadius: 10,
        alignItems: "center"
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        width: 250
    },
    price: {
        fontSize: 15,
        fontWeight: "bold",
        color: "green",
        width: 250
    }
});

export default Orders;
