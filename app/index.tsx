import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import blurBg from '../assets/image/luz.png';
import Stretch from '../assets/image/stretch.svg';
import NlwLogo from '../assets/image/NlwLogo.svg';
import { styled } from "nativewind"
import { makeRedirectUri, useAuthRequest } from "expo-auth-session"
import { useEffect } from "react"
import { api } from "../lib/api"

import * as SecureStore from 'expo-secure-store'
import { useRouter } from "expo-router"

const StyledStriped = styled(Stretch)

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/4e8a7099ee28b87b3b2c',
};

export default function App() {
  const router = useRouter();

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular, Roboto_700Bold, BaiJamjuree_700Bold
  })

  const [request, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '4e8a7099ee28b87b3b2c',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime'
      }),
    },
    discovery
  );

  const handleGithubOAuthCode = async (code: string) => {
    const { data } = await api.post('/register', {
      code
    })
    const { token } = data;
    await SecureStore.setItemAsync('token', token);
    router.push('/memories')
  }

  useEffect(() => {
    console.log(response)
    if (response?.type === 'success') {
      const { code } = response.params;
      handleGithubOAuthCode(code);
    }
  }, [response]);

  if (!hasLoadedFonts) {
    return null;
  }

  return (
    <ImageBackground imageStyle={{position: 'absolute', left: '-100%'}} source={blurBg}
                     className='bg-gray-950 px-8 flex-1 items-center relative bg-gray-900 py-10'>
      <StyledStriped className='absolute left-2'/>
      <View className='flex-1 items-center justify-center gap-6'>
        <NlwLogo/>
        <View className='space-y-2'>
          <Text className='text-center font-title text-2xl leading-tight text-gray-50'>Sua cápsula do tempo</Text>
          <Text className='text-center font-body text-base leading-relaxed text-gray-100'>Colecione momentos marcantes da sua jornada e compartilhe (se quiser) com o mundo!</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className='rounded-full bg-green-500 px-5 py-2'
          onPress={() => signInWithGithub()}
        >
          <Text className='font-alt text-sm uppercase text-black'>Cadastrar lembrança</Text>
        </TouchableOpacity>
      </View>
      <Text className='text-center font-body text-sm leading-relaxed text-gray-200'>
        Feito com ❤ no NLW da Rocketseat
      </Text>
      <StatusBar style="light" translucent/>
    </ImageBackground>
  );
}

