import { ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { Text, Input, Button, XStack, YStack, Separator, Heading, Spinner, Card } from 'tamagui'
import React, { useState, useCallback, useEffect } from 'react'
import auth from '@react-native-firebase/auth';
import firestore, { Filter } from '@react-native-firebase/firestore';
import LoadingSpinner from './LoadingSpinner';

const Home = ({ navigation, user }) => {
  // const [messages, setMessages] = useState<IMessage[]>([])
  const [userRole, setUserRole] = useState("")
  const [userList, setUserList] = useState([])
  const [adminList, setAdminList] = useState([])
  const [loading, setLoading] = useState(true);

  console.log(userRole, "userRole")
  console.log(user, "usermsb --")

  const fetchAllUserData = async () => {
    await firestore()
      .collection('users')
      .where('role', '==', 'USER')
      .get()
      .then(querySnapshot => {
        const users = [];
        // console.log('Total users: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          users.push(documentSnapshot.data());
          // console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
        });
        setUserList(users);
      });
  }


  const fetchAllAdminData = async () => {
    await firestore()
      .collection('users')
      .where('role', '==', 'ADMIN')
      .get()
      .then(querySnapshot => {
        const users = [];
        // console.log('Total users: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          users.push(documentSnapshot.data());
          // console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
        });
        setAdminList(users);
      });
  }


  useEffect(() => {
    const userId = user?.uid;

    const fetchMyData = async () => {
      try {
        if (userId) {
          const userDoc = await firestore().collection('users').doc(`${userId}`).get();
          const userData = userDoc.data();
          setUserRole(userData?.role);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user) {
      fetchMyData();
    }
  }, [user]);


  useEffect(() => {
    const fetchDataBasedOnRole = async () => {
      if (userRole === "ADMIN") {
        await fetchAllUserData();
      } else if (userRole === "USER") {
        await fetchAllAdminData();
      }
    };

    if (userRole) {
      fetchDataBasedOnRole();
    }
  }, [user, userRole])

  // console.log(userList, "usersLisr")

  const handleLogOut = async () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }

  if (!userRole) {
    return (
      <ScrollView contentContainerStyle={{
        height: "100%",
        padding: 15,
        backgroundColor: 'black',
      }} showsVerticalScrollIndicator={false}>
        <LoadingSpinner />
      </ScrollView>
    )
  }

  if (userRole === "ADMIN") {
    return (
      <ScrollView style={styles.parent}>
        <Text color="white" marginVertical="$4" fontSize="$6">Hello Admin! Chat with users and solve their queries</Text>
        <Text color="white" textAlign='center' marginVertical="$5">Users List</Text>
        {userList?.length === 0 && <Text color="white">No users have signed up yet!</Text>}
        {userList?.map((user, idx) => {
          return (
            <Card
              key={idx}
              padding="$5"
              marginVertical="$2"
              animation="100ms"
              size="$2.5"
              width="100%"
              height="auto"
              scale={0.9}
              backgroundColor='#1C1D1F'
              pressStyle={{ scale: 0.950, backgroundColor: "$backgroundPress" }}
              onPress={() => navigation.navigate("Chat", { receiverId: user?.userId })}
            >
              <Text color="white">{user?.email}</Text>
            </Card>
          )
        })}

        <Button
          marginTop="$5"
          backgroundColor="#0078FF"
          color="#FFFFFF"
          onPress={handleLogOut}
        >
          Log Out
        </Button>
      </ScrollView>
    )
  }

  if (userRole === "USER") {
    return (
      <View style={styles.parent}>
        <Text color="white" marginVertical="$4" fontSize="$6">Hello User! Chat with admins and get your queries resolved</Text>
        <Text color="white" textAlign='center' marginVertical="$5">Admin List</Text>
        {adminList?.map((admin, idx) => {
          return (
            <Card
              key={idx}
              padding="$5"
              marginVertical="$2"
              animation="100ms"
              size="$2.5"
              width="100%"
              height="auto"
              scale={0.9}
              backgroundColor='#1C1D1F'
              pressStyle={{ scale: 0.950, backgroundColor: "$backgroundPress" }}
              onPress={() => navigation.navigate("Chat", { receiverId: admin?.userId })}
            >
              <Text color="white">{admin?.email}</Text>
            </Card>
          )
        })}
        <Button
          marginTop="$5"
          backgroundColor="#0078FF"
          color="#FFFFFF"
          onPress={handleLogOut}
        >
          Log Out
        </Button>
      </View>
    )
  }
}

export default Home

const styles = StyleSheet.create({
  parent: {
    backgroundColor: "black",
    height: "auto",
    flexGrow: 1,
    padding: 20
  },
  inputToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white', // Set the background color of the input toolbar
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#b2b2b2',
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: 'black', // Set the text color to black
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendText: {
    color: '#0084ff', // Set the text color of the "Send" button
    fontWeight: 'bold',
  },
})