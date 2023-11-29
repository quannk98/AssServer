import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    FlatList,
    Dimensions,
    TextInput,
    Image,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';

const LISTPRODUCTS_API = "http://192.168.56.1:3000/api/listproducts";

function Home({ navigation }) {
    const [searchProduct, setSearchProduct] = useState("");
    const columns = 2; // Số cột
    const dataByColumns = [];
    const [data, setData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(LISTPRODUCTS_API);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data from the server:', error.message);
            }
        };

        const interval = setInterval(() => {
            fetchData();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const filteredResults = data.filter((product) =>
            product.name.toLowerCase().includes(searchProduct.toLowerCase())
        );

        setSearchResults(filteredResults);
    }, [searchProduct, data]);

    // Chia danh sách dữ liệu thành hai phần (2 cột)
    for (let i = 0; i < searchResults.length; i += columns) {
        dataByColumns.push(searchResults.slice(i, i + columns));
    }

    const DetailsProduct = (productData) => {
        navigation.navigate("ProductDetails", { productData });
    };

    const BuyProduct = async (productData) => {
        navigation.navigate("BuyProduct", { productData });
    };

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Find the product you want..."
                value={searchProduct}
                onChangeText={(text) => setSearchProduct(text)}
            />

            <FlatList
                style={{ marginBottom: 100, width: "100%", height: 660 }}
                data={dataByColumns}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item: column, index }) => {
                    return (
                        <View style={styles.columnContainer}>
                            {column.map((listproduct) => (
                                <View
                                    key={listproduct._id}
                                    style={{
                                        flexDirection: 'column',
                                        backgroundColor: 'white',
                                        borderRadius: 10,
                                        marginLeft: 10,
                                        marginRight: 5,
                                    }}
                                >
                                    <FlatList
                                        data={listproduct.images.slice(0, 2)}
                                        keyExtractor={(image, index) => index.toString()}
                                        horizontal
                                        style={{ width: 200, height: 200 }}
                                        renderItem={({ item: image }) => (
                                            <Image
                                                source={{
                                                    uri: `http://192.168.56.1:3000/Image/${image}`,
                                                }}
                                                style={[styles.image]}
                                            />
                                        )}
                                    />

                                    <TouchableOpacity onPress={() => DetailsProduct(listproduct)}>
                                        <Text style={styles.userName}>{listproduct.name}</Text>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginTop: 5,
                                                marginBottom: 5,
                                            }}
                                        >
                                            <Text style={styles.price}>{listproduct.price}$</Text>
                                            <TouchableOpacity
                                                onPress={() => BuyProduct(listproduct)}
                                            >
                                                <Image
                                                    source={require(
                                                        'E:/React Native/AssignmentAndroidServer/Img/oders-removebg-preview.png'
                                                    )}
                                                    style={styles.iconBuy}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    );
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEEEEE",
    },
    searchInput: {
        padding: 10,
        margin: 10,
        backgroundColor: "white",
        borderRadius: 10,
    },
    columnContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    image: {
        width: Dimensions.get("window").width / 2 - 40,
        height: Dimensions.get("window").width / 2 - 40,
        margin: 10,
        borderRadius: 10,
    },
    userName: {
        marginLeft: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    price: {
        width: 120,
        marginLeft: 10,
        fontSize: 20,
        color: "red",
    },
    iconBuy: {
        width: 25,
        height: 25,
        marginLeft: 10,
    },
});

export default Home;
