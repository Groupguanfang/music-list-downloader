<template>
  <main transition-all px="3 md:6 lg:14" text="dark:gray-200">
    <DefaultHeader hidden md:block />
    <RouterView px="3 md:6 lg:14" min-h-screen md:mt-15>
      <template #default="{ Component }">
        <component :is="Component" />
      </template>
    </RouterView>
  </main>
</template>
