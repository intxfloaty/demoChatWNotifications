import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Image } from 'react-native';
// import Logo from "../../../assets/images/playinxlogo.png";
import { Text, Input, Button, XStack, YStack, Separator, Heading, Spinner } from 'tamagui'
// import Icon from 'react-native-vector-icons/Ionicons';
// import { supabase } from '../../lib/supabase'
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import LoadingSpinner from '../LoadingSpinner';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';


interface Errors {
  [key: string]: string;
}

// GoogleSignin.configure({
//   scopes: ['https://www.googleapis.com/auth/drive.readonly'],
//   webClientId: '327614092631-f3i23uj7uvg0d14dprh9glrti96osvip.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
// });

const SignUpScreen = ({ navigation }) => {
  const [role, setRole] = useState("")

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false)
  //   const myIcon = <Icon name="logo-google" size={20} />;

  const validate = () => {
    let errors: Errors = {};
    if (!role) {
      errors.role = "Please select between Admin and User"
    }
    if (!email) {
      errors.email = "Please enter your email address";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = "Invalid email address";
    }
    if (!password) {
      errors.password = "Please enter a password";
    } else if (!/^(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,})$/i.test(password)) {
      errors.password =
        "Password must have minimum of 8 characters, including at least one number and one special character";
    }
    return errors;
  };

  const handleContinueClick = async () => {
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) {
      setIsLoading(true)
      await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async () => {
          console.log('User account created & signed in!');
          const userId = auth().currentUser?.uid
          // Get the FCM token
          const fcmToken = await messaging().getToken();
          await firestore()
            .collection('users')
            .doc(`${userId}`)
            .set({
              email: email,
              role: role,
              userId: userId,
              fcmToken: fcmToken,
            })
            .then(() => {
              console.log('User added!');
            });
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
            setFieldErrors({
              userExists: "User is already registered with this email",
            })
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
            setFieldErrors({
              userExists: "User is already registered with this email",
            })
          }

          console.error(error);
        });
      setIsLoading(false)
    }
  };

  //   const handleGoogleClick = async () => {
  //     setIsLoading(true)
  //     try {
  //       await GoogleSignin.hasPlayServices();
  //       const userInfo = await GoogleSignin.signIn();
  //       console.log(JSON.stringify(userInfo, null, 2))
  //       if (userInfo.idToken) {
  //         const { data, error } = await supabase.auth.signInWithIdToken({
  //           provider: 'google',
  //           token: userInfo.idToken,
  //         })
  //         console.log(error, data)
  //       } else {
  //         throw new Error('no ID token present!')
  //       }
  //     } catch (error: any) {
  //       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //         // user cancelled the login flow
  //       } else if (error.code === statusCodes.IN_PROGRESS) {
  //         // operation (e.g. sign in) is in progress already
  //       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //         // play services not available or outdated
  //       } else {
  //         // some other error happened
  //       }
  //     }
  //     setIsLoading(false)
  //   };

  useEffect(() => {
    if (Object.keys(fieldErrors).length !== 0) {
      setFieldErrors(validate());
    }
  }, [email, password, role]);


  return (
    <ScrollView contentContainerStyle={styles.parent} showsVerticalScrollIndicator={false}>
      <View style={styles.child}>
        {/* <Image source={Logo} style={styles.logo} resizeMode="contain" /> */}
        <Heading marginBottom={20} textAlign='center' color="#FFFFFF" fontWeight="bold">SIGN UP</Heading>
        {isLoading && <LoadingSpinner />}
        <YStack
          flex={1}
          justifyContent='center'
          space="$2"
          borderWidth={2}
          borderColor="$color"
          borderRadius="$4"
          padding="$2"
        >
          {fieldErrors.role && (
            <Text textAlign='center' color="#FFB400">
              {fieldErrors.role}
            </Text>
          )}
          <XStack alignItems='center' justifyContent='center' marginVertical="$8" space="$4">
            <Button
              backgroundColor={role === "ADMIN" ? "#0078FF" : "white"}
              onPress={() => setRole("ADMIN")}>
              ADMIN
            </Button>
            <Button
              backgroundColor={role === "USER" ? "#0078FF" : "white"}
              onPress={() => setRole("USER")}>
              USER</Button>
          </XStack>

          {fieldErrors.email && (
            <Text textAlign='center' color="#FFB400">
              {fieldErrors.email}
            </Text>
          )}
          <Input
            keyboardType='email-address'
            backgroundColor="#161616"
            color="antiquewhite"
            borderColor="$blue10Light"
            size="$3.5"
            placeholder="Email"
            value={email}
            onChangeText={(e) => setEmail(e)}
          />

          <Input
            secureTextEntry={true}
            backgroundColor="#161616"
            color="antiquewhite"
            borderColor="$blue10Light"
            size="$3.5"
            placeholder="Password"
            value={password}
            onChangeText={(e) => setPassword(e)}
          />
          {fieldErrors.password && (
            <Text textAlign='center' color="#FFB400">
              {fieldErrors.password}
            </Text>
          )}

          <Button
            marginTop="$5"
            backgroundColor="#0078FF"
            color="#FFFFFF"
            onPress={handleContinueClick}
          >
            Continue
          </Button>

          {fieldErrors.userExists && (
            <Text textAlign='center' color="#FFB400">
              {fieldErrors.userExists}
            </Text>
          )}

          <Text
            marginTop="$3"
            textAlign='center'
            color="#FFFFFF"
            onPress={() => navigation.navigate("SignIn")}
          >
            Already have an account? Log In
          </Text>

          {/* <XStack
            marginVertical={30}
            space="$2"
            borderWidth={2}
            borderColor="$color"
            borderRadius="$4"
            padding="$2"
            alignItems='center'
            justifyContent='center'
          >
            <Separator borderColor="gray" />
            <Text textAlign='center' color="gray">or sign up with</Text>
            <Separator borderColor="gray" />
          </XStack>

          <Button
            backgroundColor="#0078FF"
            color="#FFFFFF"
            // icon={myIcon}
            // onPress={handleGoogleClick}
            >
            Google
          </Button> */}

        </YStack>

      </View>
    </ScrollView>
  );
}



export default SignUpScreen;

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    backgroundColor: '#161616',
  },
  child: {
    height: '100%',
    padding: 20,
  },
  logo: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
});