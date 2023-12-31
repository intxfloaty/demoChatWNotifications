import { StyleSheet, TextInput, View } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { Text, Input, Button, XStack, YStack, Separator, Heading, Spinner, Card } from 'tamagui'
import { GiftedChat, IMessage, Send } from 'react-native-gifted-chat'
import firestore, { Filter } from '@react-native-firebase/firestore';
import axios from 'axios';
import auth from '@react-native-firebase/auth';


const ChatScreen = ({ navigation, route }) => {
  const { receiverId } = route.params;
  const [messages, setMessages] = useState<IMessage[]>([])
  const currentUserId = auth().currentUser.uid


  const sendNotification = async (receiverId) => {
    const userDoc = await firestore().collection('users').doc(`${receiverId}`).get()
    const userData = userDoc.data();
    const userDevicetoken = userData?.fcmToken
    await fetch("https://sendnotification-eewoweqfuq-uc.a.run.app", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: userDevicetoken
      })
    })
  }

  const loadMessages = () => {
    try {
      const query = firestore()
        .collection('messages')
        .where('senderId', "in", [currentUserId, receiverId])
        .where('receiverId', "in", [currentUserId, receiverId])
        .orderBy('createdAt', 'desc');

      const unsubscribe = query.onSnapshot((querySnapshot) => {
        const loadedMessages: IMessage[] = [];
        querySnapshot.forEach((doc) => {
          const messageData = doc.data();
          loadedMessages.push({
            _id: doc.id,
            text: messageData.text,
            createdAt: messageData.createdAt.toDate(),
            user: {
              _id: messageData.senderId,
              name:"User Name"
            },
          });
        });
        setMessages(loadedMessages);
      });

      // Return the object with the unsubscribe method
      return unsubscribe;
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // UseEffect to subscribe/unsubscribe when the component mounts/unmounts
  useEffect(() => {
    const unsubscribe = loadMessages();

    // Unsubscribe when the component is unmounted
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Call the unsubscribe method on the object
      }
    };
  }, []);


  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    const message = newMessages[0];
    try {
      await firestore().collection('messages').add({
        senderId: currentUserId,
        receiverId: receiverId,
        text: message.text,
        createdAt: new Date(),
      });
      sendNotification(receiverId)
      // setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    } catch (error) {
      console.log('Error sending message:', error);
    }
  }, [currentUserId, receiverId]);

  const renderInputToolbar = (props: any) => (
    <View style={styles.inputToolbar}>
      <TextInput
        style={styles.textInput}
        placeholder="Type a message..."
        placeholderTextColor="gray"
        multiline
        value={props.text}
        onChangeText={props.onTextChanged}
      />
      <Send {...props} containerStyle={styles.sendContainer}>
        <Text style={styles.sendText}>Send</Text>
      </Send>
    </View>
  )


  return (
    <>
      <Button justifyContent='flex-start' alignItems='flex-start' onPress={() => navigation.goBack()}>
        Go Back
      </Button>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: currentUserId, // Use the logged-in user's ID
        }}
        showAvatarForEveryMessage
        renderInputToolbar={renderInputToolbar}
      />
    </>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  parent: {
    backgroundColor: "black",
    height: "auto",
    flexGrow: 1
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