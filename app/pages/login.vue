<script setup>
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const { $auth } = useNuxtApp()

const login = async () => {
  const provider = new GoogleAuthProvider()
  await signInWithPopup($auth, provider)
  navigateTo('/')
}
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <UCard class="w-96 text-center">
      <h1 class="text-xl font-bold mb-4">Agenda do Eletricista</h1>
      <UButton block @click="login">
        Entrar com Google
      </UButton>
    </UCard>
  </div>
</template>
