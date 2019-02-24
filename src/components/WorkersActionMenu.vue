<template>
    <v-speed-dial
            :bottom="true"
            :right="true"
            :fixed="true"
            direction="top"
            transition="slide-x-reverse-transition"
    >
        <v-btn
                slot="activator"
                v-model="trigger"

                @click="trigger=!trigger"
                color="blue darken-2"
                dark
                fab
        >
            <v-icon>work</v-icon>
            <v-icon>close</v-icon>
        </v-btn>

        <v-tooltip left>
            <v-btn
                    fab
                    dark
                    small
                    color="green"
                    @click="createNewShift"
                    slot="activator"
            >
                <v-icon>person_add</v-icon>
            </v-btn>
            <span>create new shift</span>
        </v-tooltip>
    </v-speed-dial>
</template>
<script>

    export default {
        name: 'WorkersActionMenu',
        data() {
            return {
                data: [],
                trigger: false
            }
        },
        methods: {
            createNewShift() {
                this.$root.$emit('showCreateWorkerDialog', true)
                this.trigger= false

            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>