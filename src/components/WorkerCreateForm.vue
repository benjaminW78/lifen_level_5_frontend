<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="600px">

            <v-card>
                <v-card-title>
                    <span class="headline">Create new shift</span>
                </v-card-title>
                <v-card-text>
                    <v-alert v-if="error"
                             :value="error"
                             color="error"
                             icon="warning">{{error}}
                    </v-alert>
                    <v-container grid-list-md>
                        <v-layout wrap>

                            <v-flex xs12>
                                <v-text-field
                                        label="Name"
                                        v-model="name"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-select
                                        v-model="status"
                                        :items="workersStatus"
                                        :item-text="text"
                                        item-value="abbr"
                                        label="Select status for this worker*"
                                        required
                                        persistent-hint
                                        return-object
                                        @change="shiftPricePerDay=status.shift_price"
                                        single-line
                                ></v-select>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                        label="Price per day (can be changed)"
                                        v-model="shiftPricePerDay"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="()=>{clean();dialog = false}">Close
                    </v-btn>
                    <v-btn color="blue darken-1" flat @click="submit"
                           :disabled="!name||!status||!shiftPricePerDay">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>
<script>
    import axios from 'axios'
    import Configuration from '../configuration'

    const request = new axios.create({
        baseURL: Configuration.service.backendUrl
    })

    export default {
        name: 'WorkerCreateForm',
        data() {
            return {
                data: [],
                dialog: false,
                error: null,
                shiftPricePerDay: null,
                status: null,
                name: null,
                worker: null

            }
        },
        props: {
            workersStatus: Array
        },
        mounted() {
            this.$root.$on('showCreateWorkerDialog', data => this.dialog = data)
        },

        methods: {
            clean() {
                this.shiftPricePerDay = null
                this.status = null
                this.name = null
                this.error = null
            },
            text: item => item.name,

            submit(event) {
                event.preventDefault()
                if (this.name && this.status && this.shiftPricePerDay) {
                    const payload = {
                        first_name: this.name,
                        status: this.status.name,
                        shift_price_per_day: this.shiftPricePerDay
                    }
                    request.post('/workers', payload).then(() => {
                        this.dialog = false
                        this.$root.$emit('updateWorkersList', true)
                        this.clean()
                    }).catch(err => {
                        if (err.response.data) {
                            this.error = `${err.response.data.message}. actually overlaping ${err.response.data.shiftsOverLaping.length} shifts`
                        }
                    })
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>