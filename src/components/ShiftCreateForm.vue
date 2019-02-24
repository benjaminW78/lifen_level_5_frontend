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
                                <v-date-range v-model="range" style="display: grid" :value="{}"
                                              display-format="DD-MM-YYYY"></v-date-range>
                            </v-flex>

                            <!--<v-flex xs12 sm6 md4>-->
                            <!--<v-datetime-picker-->
                            <!--required-->
                            <!--label="Select start date/time for this shift"-->
                            <!--v-model="start_date"-->
                            <!--:click="updateEndDate"></v-datetime-picker>-->
                            <!--</v-flex>-->
                            <!--<v-flex xs12 sm6 md4>-->
                            <!--<v-datetime-picker-->
                            <!--required-->
                            <!--label="Select end date/time for this shift"-->
                            <!--v-model="end_date"></v-datetime-picker>-->

                            <!--</v-flex>-->
                            <v-flex xs12>
                                <v-select
                                        v-model="worker"
                                        :items="workers"
                                        :item-text="text"
                                        item-value="abbr"
                                        label="Select worker for this shift *"
                                        required
                                        persistent-hint
                                        return-object
                                        single-line
                                ></v-select>
                            </v-flex>
                            <v-flex xs12>
                                <v-checkbox label="allow overlap with others shifts *" required
                                            v-model="overlap" @change="error=null"></v-checkbox>
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
                           :disabled="!worker||!range.start||!range.end">
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
        name: 'ShiftsCreateForm',
        data() {
            return {
                data: [],
                dialog: false,
                worker: null,
                overlap: false,
                range: {},
                duration: null,
                error: null
            }
        },
        props: {
            daysMultiplicators: Array,
            workers: Array
        },
        mounted() {
            this.$root.$on('showCreateShiftDialog', data => this.dialog = data)
        },

        methods: {
            text: item => item.first_name + ' — ' + item.status,
            clean() {
                this.worker = null
                this.range = {}
                this.overlap = false
                this.error = null
                this.$forceUpdate()
            },
            submit(event) {
                event.preventDefault()
                if (this.range && this.range.end && this.range.start && this.worker) {

                    const payload = {
                        start_date: this.range.start,
                        end_date: this.range.end,
                        user_id: this.worker._id,
                        allow_overlap: this.overlap,
                        basic_price_per_day: this.worker.shift_price_per_day
                    }
                    request.post('/shifts', payload).then(() => {
                        this.dialog = false
                        this.$root.$emit('updateShiftList', true)
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