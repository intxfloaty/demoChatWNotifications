import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Image } from 'react-native';
// import Logo from "../../../assets/images/playinxlogo.png";
import { Text, Input, Button, XStack, YStack, Separator, Heading, Spinner } from 'tamagui'
// import Icon from 'react-native-vector-icons/Ionicons';
import LoadingSpinner from '../LoadingSpinner';
// import { supabase } from '../../lib/supabase'
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';


interface Errors {
  [key: string]: string;
}

const SignInScreen = ({ navigation }) => {
  const [role, setRole] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    let errors: Errors = {};
    // if (!role) {
    //   errors.role = "Please select between Admin and User"
    // }
    if (!email) {
      errors.email = "Please enter your email address";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = "Invalid email address";
    }
    if (!password) {
      errors.password = "Please enter your password to login";
    } else if (!/^(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,})$/i.test(password)) {
      errors.password =
        "Password must have minimum of 8 characters, including at least one number and one special character";
    }
    return errors;
  };

  const handleLogin = async () => {
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) {
      setIsLoading(true)
      await auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User signed in!');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
            setFieldErrors({
              userExists: "User is already registered with this email",
            })
          }

          if (error.code === 'auth/invalid-credential') {
            console.log('That email address is invalid!');
            setFieldErrors({
              userExists: "Invalid credentials. Please sign up!",
            })
          }

          console.error(error);
        });
      setIsLoading(false)
    }
  };





  useEffect(() => {
    if (Object.keys(fieldErrors).length !== 0) {
      setFieldErrors(validate());
    }
  }, [email, password]);


  return (
    <ScrollView contentContainerStyle={styles.parent} showsVerticalScrollIndicator={false}>
      <View style={styles.child}>
        {/* <Image source={Logo} style={styles.logo} resizeMode="contain" /> */}
        <Heading marginBottom={20} textAlign='center' color="#FFFFFF" fontWeight="bold">LOG IN</Heading>
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

          {/* {fieldErrors.role && (
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
          </XStack> */}

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
            onPress={handleLogin}
          >
            Log In
          </Button>

          {fieldErrors.userExists && (
            <Text textAlign='center' color="#FFB400">
              {fieldErrors.userExists}
            </Text>
          )}

          {/* <Text
            marginTop="$3"
            textAlign='center'
            color="#FFFFFF"
            onPress={() => navigation.navigate("ForgotPassword")}>
            Forgotten Password?
          </Text> */}

          <Text
            marginTop="$3"
            textAlign='center'
            color="#FFFFFF"
            onPress={() => navigation.navigate("SignUp")}>
            Don't have an account? Sign Up
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
            icon={myIcon}
            onPress={handleGoogleClick}>
            Google
          </Button> */}
        </YStack>

      </View>
    </ScrollView>
  );
}


export default SignInScreen;

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