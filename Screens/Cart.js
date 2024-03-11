import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from 'react-native-check-box';

const API_USER = "http://192.168.0.101:3000/api/customer/"
const API_CART = "http://192.168.0.101:3000/api/cart/";
const API_BILL = "http://192.168.0.101:3000/api/buyhistory"
const LISTPRODUCTS_API = "http://192.168.0.101:3000/api/listproducts";
const API_CARTUP = "http://192.168.0.101:3000/api/cartup/";
const API_CARTDELETE = "http://192.168.0.101:3000/api/cartdelete/";


const Cart = ({ navigation, route }) => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [show, setShow] = useState(true)
    const [password, setPassword] = useState('')
    const [idUser, setidUser] = useState('')
    const [name, setName] = useState('');
    const [money, setMoney] = useState();
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');


    useEffect(() => {
        const interval = setInterval(() => {
            getCartItems();
            loadCustomerDataFromServer()
        }, 1000)
        return () => clearInterval(interval);
    }, []);
    const loadNameFromStorage = async () => {
        try {
            const nameFromStorage = await AsyncStorage.getItem('nameCustomer');
            setName(nameFromStorage);

        } catch (error) {
            console.error('Error loading name from AsyncStorage:', error);
        }
    };
    const loadCustomerDataFromServer = async () => {

        try {
            const nameFromStorage = await AsyncStorage.getItem('nameCustomer');
            setName(nameFromStorage);
            const response = await axios.get(API_USER + nameFromStorage);

            if (response.data.success) {
                const customerData = response.data.customer;
                setidUser(customerData._id)
                setMoney(customerData.money)
                setPassword(customerData.password)
                setAddress(customerData.address)
                setPhone(customerData.phone)

            } else {
                console.error('Error fetching customer data:', response.data.message);
            }
        } catch (error) {
            console.error('Error loading user data from server:', error);
        }
    };

    useEffect(() => {
        loadNameFromStorage();
    }, []);
    useEffect(() => {
        
        loadCustomerDataFromServer();
    }, [name]);
    const getCartItems = async () => {
        try {
            const nameFromStorage = await AsyncStorage.getItem("nameCustomer");
            const response = await axios.get(API_CART + nameFromStorage);
            if (response.status === 200) {
                if (response.data.length === 0) {
                    setShow(true)
                }
                else {
                    setShow(false)
                    setCartItems(response.data);

                }
            }
            else {
                setShow(true)

            }



        } catch (error) {
            console.log("2" + error);
        }
    };
    const handleCheckboxChange = (itemId) => {
        const updatedSelectedItems = selectedItems.includes(itemId) ?
            selectedItems.filter(_id => _id !== itemId) :
            [...selectedItems, itemId];
        setSelectedItems(updatedSelectedItems);
        calculateTotalAmount(updatedSelectedItems);
    };

    const calculateTotalAmount = (selectedItems) => {
        let total = 0;
        cartItems.forEach(item => {
            if (selectedItems.includes(item._id)) {
                const price = Number(item.price);
                total += price * (item.quantity);
            }
        });
        setTotalAmount(total);
    };

    const handQuantityChange = async (itemId, quantity) => {
        if (quantity < 1) {
            ToastAndroid.show("Số lượng không được nhỏ hơn 1", 2);
            return;
        }

        try {
            const nameFromStorage = await AsyncStorage.getItem("nameCustomer");
            const itemToUpdate = cartItems.find((item) => item._id === itemId);
            if (!itemToUpdate) {
                console.log("sản phẩm không tồn tại!");
                return;
            }

            const response = await axios.put(API_CARTUP + itemId, {
                name_customer: nameFromStorage,
                ...itemToUpdate,
                quantity: quantity,
            });

            if (response.status === 200) {
                const updateCartItems = cartItems.map((item) =>
                    item._id === itemId ? { ...item, quantity } : item
                );
                setCartItems(updateCartItems);
                totalAmount(selectedItems);
            } else {
                ToastAndroid.show("Lỗi không cập nhật số lượng sản phẩm", 2);
            }
        } catch (error) {
            console.log("haha" + error);
            // ToastAndroid.show("Lỗi không cập nhật số lượng sản phẩm", 2);
        }
    };


    const handleRemoveItem = async (itemId) => {
        try {
            const response = await axios.delete(API_CARTDELETE + itemId);
            if (response.status === 200) {
                ToastAndroid.show("Đã xóa sản phẩm khỏi giỏ hàng", 2);
                const updatedCartItems = cartItems.filter(item => item._id !== itemId);
                setCartItems(updatedCartItems);
                const updatedSelectedItems = selectedItems.filter(_id => _id !== itemId);
                setSelectedItems(updatedSelectedItems);
                calculateTotalAmount(updatedSelectedItems);
            } else {
                ToastAndroid.show("Lỗi không xóa sản phẩm khỏi giỏ hàng1", 2);
            }
        } catch (error) {
            console.error("1" + error);
            ToastAndroid.show("Lỗi khi xóa sản phẩm khỏi giỏ hàng", 2);
        }
    };
    const handleBuySelectedItems = async () => {
        try {
            const name = await AsyncStorage.getItem("nameCustomer");
            const promises = selectedItems.map(async (itemId) => {
                const selectedItem = cartItems.find((item) => item._id === itemId);
                if (selectedItem) {

                    const total = parseFloat(selectedItem.quantity) * parseFloat(selectedItem.price)
                    console.log("qa" + total)
                    console.log("qa1" + money)
                    if (money < total) {
                        ToastAndroid.show("Tài khoản của bạn không đủ để thanh toán", 2);
                        return;
                    } else if (selectedItem.quantity_product < selectedItem.quantity) {
                        ToastAndroid.show("Số lượng sản phẩm không đủ", 2);
                        return;
                    } else {
                        const response = await axios.post(API_BILL, {
                            name: selectedItem.name_product,
                            total: total,
                            quantity: selectedItem.quantity,
                            buyer: name,
                            phone: phone,
                            address: address,
                            images: selectedItem.images[0],
                        });

                        if (response.data.success) {
                            navigation.navigate("TabBottom");
                            ToastAndroid.show("Mua Hàng Thành Công", 2);

                        } else {
                            console.error("Error buying product:", response.data.message);
                            ToastAndroid.show("Đã xảy ra lỗi khi mua hàng", 2);
                        }
                    }
                }
            });

            await Promise.all(promises);
            navigation.navigate("TabBottom");


        } catch (error) {
            console.log("Error while buying selected items:", error);
            navigation.navigate("TabBottom");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={{ alignItems: "center" }}>
                <Text style={{ marginTop: 10, fontSize: 25, fontWeight: "bold", color: "black", marginBottom: 10 }}>Giỏ Hàng</Text>
            </View>
            {show ? (<Text style={{ fontSize: 20, fontWeight: "bold", height: "80%", marginTop: 20 }}>Hiện Không Có Sản Phẩm Nào Trong Giỏ Hàng</Text>) :
                (<FlatList
                    data={cartItems}
                    renderItem={({ item }) => (
                        <View style={styles.cartItem}>
                            <Image
                                source={{ uri: `http://192.168.0.101:3000/Image/${item.images[0]}` }}
                                style={styles.image}
                            />
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{item.name_product}</Text>
                                <Text style={styles.itemPrice}>{item.price}$</Text>
                            </View>
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                    onPress={() => handQuantityChange(item._id, item.quantity - 1)}
                                >
                                    <Text style={styles.quantityButton}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() => handQuantityChange(item._id, item.quantity + 1)}
                                >
                                    <Text style={styles.quantityButton}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <CheckBox
                                style={styles.checkbox}
                                onClick={() => handleCheckboxChange(item._id)}
                                isChecked={selectedItems.includes(item._id)}
                            />
                            <TouchableOpacity onPress={() => handleRemoveItem(item._id)}>
                                <Image source={require("E:/React Native/AssignmentAndroidServer/Img/xRed-removebg-preview.png")} style={{ width: 25, height: 25, margin: 10 }} />
                            </TouchableOpacity>
                        </View>
                    )}
                />)}
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total:</Text>
                <Text style={styles.totalAmountText}>${totalAmount}</Text>
                <TouchableOpacity onPress={() => handleBuySelectedItems()}>
                    <View style={{ backgroundColor: '#6699FF', width: 180, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>BUY</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "90%",
        backgroundColor: '#EEEEEE',
        padding: 16,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#FFF',
        margin: 5,
        borderRadius: 8
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 4,
        margin: 10
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        width: 80,
        color: "red"

    },
    itemPrice: {
        fontSize: 14,
        color: "green"
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    quantityButton: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        marginHorizontal: 8,


    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalAmountText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
export default Cart;
