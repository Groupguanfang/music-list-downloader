<template>
  <main transition-all px="3 md:6 lg:14" text="dark:gray-200">
    <DefaultHeader hidden md:block />
    <RouterView px="3 md:6 lg:14" min-h-screen mt-10 md:mt-20 pb-30>
      <template #default="{ Component }">
        <Transition
          enter-active-class="transition ease-in-out duration-200"
          enter-to-class="opacity-100"
          leave-active-class="transition ease-in-out duration-200"
          leave-to-class="opacity-0"
        >
          <KeepAlive :exclude="[/Detail$/, 'My']">
            <component :is="Component" />
          </KeepAlive>
        </Transition>
      </template>
    </RouterView>
  </main>
</template>
