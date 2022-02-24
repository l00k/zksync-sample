<template>
    <div id="app">
        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>

<script lang="ts">
import BaseComponent from '@inti5/app-frontend/Component/BaseComponent.vue';
import { Component } from '@inti5/app-frontend/Vue/Annotations/Component';

@Component()
export default class App
    extends BaseComponent
{
}
</script>

<style lang="scss" src="@/assets/scss/app.scss" />
