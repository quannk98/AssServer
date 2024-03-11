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
    ToastAndroid,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LISTPRODUCTS_API = "http://192.168.0.101:3000/api/listproducts";
const APIPOST_FAVORITE = "http://192.168.0.101:3000/api/favorite";
const API_FAVORITE = "http://192.168.0.101:3000/api/favorite/";
const API_DELETEFA = "http://192.168.0.101:3000/api/favoritedelete/"

function Home({ navigation }) {
    const [searchProduct, setSearchProduct] = useState("");
    const columns = 2; // Số cột
    const dataByColumns = [];
    const [data, setData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [favoriteProducts, setFavoriteProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const nameFromStorage = await AsyncStorage.getItem("nameCustomer");
                const response = await axios.get(LISTPRODUCTS_API);
                const responsefa = await axios.get(API_FAVORITE + nameFromStorage)
                setData(response.data);
                setFavoriteProducts(responsefa.data)

            } catch (error) {
                console.error('Error fetching data from the server:', error.message);
            }
        };

        const interval = setInterval(() => {
            fetchData();
        }, 2000);

        return () => clearInterval(interval);
    }, []);
    const isProductFavorite = (product) => {
        return favoriteProducts.some((favProduct) => favProduct.name_product === product.name);
    };
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
    const Add_favorite = async (productData) => {
        console.log(productData.name)

        try {
            const nameFromStorage = await AsyncStorage.getItem("nameCustomer");

            if (!nameFromStorage) {
                ToastAndroid.show("Tên khách hàng không hợp lệ", 2);
                return;
            }

            const favoriteProductIndex = favoriteProducts.findIndex((favProduct) => favProduct.name_product === productData.name)
            console.log(favoriteProductIndex)

            if (favoriteProductIndex >= 0) {
               
                await axios.delete(API_DELETEFA + productData.name);
                const updatedFavorites = favoriteProducts.filter((favProduct) => favProduct.name_product !== productData.name);
                setFavoriteProducts(updatedFavorites);
                ToastAndroid.show("Đã xóa sản phẩm khỏi danh sách yêu thích", 2);

                // Add to favorites

            }
            else {
                
                const responseFa = await axios.post(APIPOST_FAVORITE, {
                    name_customer: nameFromStorage,
                    name_product: productData.name,
                    img_product: productData.images[0],
                });

                if (responseFa.data.success) {
                   
                    setFavoriteProducts((prevFavorites) => [...prevFavorites, responseFa.data]);
                    ToastAndroid.show("Đã thêm sản phẩm vào danh sách yêu thích", 2);
                }
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    ToastAndroid.show(error.response.data.message, 2);
                } else {
                    ToastAndroid.show("Lỗi không thể thêm vào danh sách yêu thích 1", 2);
                }
            } else {
                ToastAndroid.show("Lỗi không thể thêm vào danh sách yêu thích", 2);
            }
        }
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
                style={{ marginBottom: 100, width: "98%", height: 660 }}
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
                                        width:180,
                                        borderRadius: 10,
                                        marginLeft: 10,
                                        marginRight: 5,
                                    }}
                                >
                                    <FlatList
                                        data={listproduct.images.slice(0, 2)}
                                        keyExtractor={(image, index) => index.toString()}
                                        horizontal
                                        style={{ width: 180, height: 200}}
                                        renderItem={({ item: image }) => (
                                            <Image
                                                source={{
                                                    uri: `http://192.168.0.101:3000/Image/${image}`,
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
                                            <TouchableOpacity onPress={() => Add_favorite(listproduct)}>
                                                <Image
                                                    source={isProductFavorite(listproduct) ? require('E:/React Native/AssignmentAndroidServer/Img/heart_like.png') : require('E:/React Native/AssignmentAndroidServer/Img/heart_unlike.png')}
                                                    style={styles.iconFa}
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
        width: Dimensions.get("window").width / 2 - 45,
        height: Dimensions.get("window").width / 2 -45,
        margin: 10,
        borderRadius: 10,
    },
    userName: {
        marginLeft: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    price: {
        width: 100,
        marginLeft: 10,
        fontSize: 20,
        color: "red",
    },
    iconBuy: {
        width: 25,
        height: 25,
    },
    iconFa: {
        width: 25,
        height: 25,
        marginStart: 10
    },
});

export default Home;
