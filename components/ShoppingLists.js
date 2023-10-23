import React, { useState, useEffect } from "react";
import { 
  StyleSheet, View, FlatList, Text, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, Alert 
} from "react-native";
import { collection, getDocs, addDoc, onSnapshot, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";


const ShoppingLists = ({ db, route, isConnected }) => {
  const { userID } = route.params;

  const [lists, setLists] = useState([]);
  const [listName, setListName] = useState("");
  const [item1, setItem1] = useState("");
  const [item2, setItem2] = useState("");


  // const fetchShoppingLists = async () => {
  //   // Getting all documents of a collection. Function calls the database object, which you just passed from the App component (db). Second argument is the collection name you’re trying to point towards (“shoppinglists”)
  //   const listsDocuments = await getDocs(collection(db, "shoppinglists")); 
  //   let newLists = [];
  //   listsDocuments.forEach(docObject => {       // forEach() loop adds an object (has its property id) to the newLists array using the .push() function
  //     newLists.push({ id: docObject.id, ...docObject.data() }) // The object being added will also have whatever returned from ...docObject.data() (using the ... operator, the properties of docObject.data() will be spread out)
  //   });
  //   setLists(newLists);
  // }

  // useEffect(() => {
  //   // fetchShoppingLists();
  // }, [`${lists}`]);

  let unsubShoppinglists;

  useEffect(() => {        //  whenever query(collection...) is changed by an add, remove, or update query, the onSnapshot() callback will be called. This means the cache will be kept up to date as long as there’s an internet connection.
        
    if (isConnected === true) {

      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubShoppinglists) unsubShoppinglists();
      unsubShoppinglists = null;

      const q = query(collection(db, "shoppinglists"), where("uid", "==", userID));
      unsubShoppinglists = onSnapshot(q, (documentsSnapshot) => {
        let newLists = [];
        documentsSnapshot.forEach(doc => {
          newLists.push({ id: doc.id, ...doc.data() })
        });
        cacheShoppingLists(newLists);      
        setLists(newLists);
      }); 
    } else loadCachedLists();     

    // Clean up code
    return () => {
      if (unsubShoppinglists) unsubShoppinglists();
    }
  }, [isConnected]);      // Passing isConnected to the dependency array of useEffect(). As a result, ShoppingLists’s useEffect() callback function can be called multiple times (not once the component is mounted), as isConnected’s status can change at any time.


  // This function is called if the isConnected prop turns out to be false in useEffect()
  const loadCachedLists = async () => {
    const cachedLists = await AsyncStorage.getItem("shopping_lists") || [];
    setLists(JSON.parse(cachedLists));
  }

  const cacheShoppingLists = async (listsToCache) => {
    try {
      await AsyncStorage.setItem('shopping_lists', JSON.stringify(listsToCache));
    } catch (error) {
      console.log(error.message);
    }
  }  

  const addShoppingList = async (newList) => {
    const newListRef = await addDoc(collection(db, "shoppinglists"), newList);

    if (newListRef.id) {
      setLists([newList, ...lists]);
      Alert.alert(`The list "${listName}" has been added.`);
    } else {
      Alert.alert("Unable to add. Pleaase try later");
    }
  }


  return (
    <View style={styles.container}>
      <FlatList
        style={styles.listsContainer}
        data={lists}
        renderItem={ ({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.name}: {item.items.join(", ")}</Text>         
            {/* // The array function join() converts an array into a string. The function also adds a separator string between each element from the array once concatenated  */}
          </View>          
        )} 
      />
      {(isConnected === true) ?    // A ternary-operator-based conditional - checks the isConnected state. If it’s true, the form will be rendered; otherwise, nothing (null) will be rendered.
        <View style={styles.listForm}>
          <TextInput
            style={styles.listName}
            placeholder="List Name"
            value={listName}
            onChangeText={setListName}
          />
          <TextInput
            style={styles.item}
            placeholder="Item #1"
            value={item1}
            onChangeText={setItem1}
          />
          <TextInput
            style={styles.item}
            placeholder="Item #2"
            value={item2}
            onChangeText={setItem2}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              const newList = {
                uid: userID,
                name: listName,
                items: [item1, item2]
              }
              addShoppingList(newList);
            }}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View> : null
      }
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : Platform.OS === 'ios' ? 'padding' : undefined}
      />
    </View>
  ) 
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listsContainer: {

  },

  listItem: {
    height: 70,
    justifyContent: "center",
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#AAA",
    flex: 1,
    flexGrow: 1
  },

  listForm: {
    flexBasis: 275,
    flex: 0,
    margin: 15,
    padding: 15,
    backgroundColor: "#CCC"
  },

  listName: {
    height: 50,
    padding: 15,
    fontWeight: "600",
    marginRight: 50,
    marginBottom: 15,
    borderColor: "#555",
    borderWidth: 2
  },

  item: {
    height: 50,
    padding: 15,
    marginLeft: 50,
    marginBottom: 15,
    borderColor: "#555",
    borderWidth: 2
  },

  addButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "#000",
    color: "#FFF"
  },

  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 20
  },

});


export default ShoppingLists;