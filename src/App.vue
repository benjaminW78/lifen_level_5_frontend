<template>
    <v-app>
        <v-toolbar color="primary">
            <v-toolbar-title class="text-uppercase text--primary">Hospital shifts scheduler</v-toolbar-title>
            <v-spacer></v-spacer>
            <!--<router-link to="/" tag="button">Home</router-link>-->

            <v-toolbar-items class="hidden-xs-only">
                <v-btn flat @click="$router.push('/')">Shifts management</v-btn>
                <v-btn flat @click="$router.push('/workers')">Workers management</v-btn>


            </v-toolbar-items>
            <!--<router-link to="/about" tag="button">About</router-link>-->
        </v-toolbar>
        <v-alert
                :value="true"
                color="info"
                icon="info"
                outline
                dismissible
        >
            App hosted on heroku on free instances, you may experience a little delay before backend server wake up from
            sleep
        </v-alert>
        <router-view/>
    </v-app>
</template>
