import React, { Component } from 'react';
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
} from 'react-native';

function ProductDetails({ navigation, route }) {
    const { productData } = route?.params;
    console.log("haa" + JSON.stringify(productData.images));

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20 }}>PRODUCT DETAILS</Text>

            <FlatList
                data={productData.images.slice(0, 2)}
                keyExtractor={(image, index) => index.toString()}
                horizontal
                style={{ width: 200, height: 200 }}
                renderItem={({ item: image }) => (
                    <Image
                        source={{ uri: `http://192.168.56.1:3000/Image/${image}` }}
                        style={[styles.image]}
                    />
                )}
            />
            <Text style={styles.name}>{productData.name}</Text>
            <Text style={styles.price}>Price:{productData.price}$</Text>
            <Text style={styles.color}>Color:{productData.color}</Text>
            <Text style={styles.type}>Product type: {productData.type}</Text>
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
        width: Dimensions.get("window").width / 2 - 40,
        height: Dimensions.get("window").width / 2 - 40,
        margin: 10,
        borderRadius: 10,
        backgroundColor:"white"
    },
    name: {
        fontSize: 40,
        fontWeight: "bold",
        color: "red",
        marginTop: 10
    },
    price: {
        fontSize: 30,
        fontWeight: "bold",
        color: "green",
        marginTop: 10
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
    }
})

export default ProductDetails;
