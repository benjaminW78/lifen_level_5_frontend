<template>
    <v-container grid-list-sm>
        <v-layout row>
            <v-alert v-if="error"
                     :value="error"
                     color="error"
                     icon="warning">{{error}}
            </v-alert>
        </v-layout>
        <v-layout row>
            <v-data-table
                    class="elevation-1 fixed-header fixed-header v-table__overflow"
                    xs9

                    hide-footer
                    v-model="selected"
                    :style="{marginTop:'4px' ,marginLeft:'2rem'}"
                    :headers="headers"
                    :items="shifts"
                    :loading="loading"
                    :rows-per-page-items="[100]"
            >
                <template slot="no-data">
                    <v-alert :value="true" color="warning" icon="warning">
                        No shifts founds
                    </v-alert>
                </template>
                <template slot="items" slot-scope="props">
                    <!--<tr :active="props.selected" @click="props.selected = !props.selected">-->
                    <td class="text-xs-right">{{ props.item.planning_id }}</td>
                    <td class="text-xs-right">{{ (props.item.user)?props.item.user.first_name :'-' }}</td>
                    <td class="text-xs-right">{{ formatDate(props.item.start_date)|| '-' }}</td>
                    <td class="text-xs-right">{{ formatDate(props.item.end_date) || '-' }}</td>
                    <td class="text-xs-right">{{ props.item.duration || '-' }}</td>
                    <td class="text-xs-right">{{ props.item.shift_price || '-' }}</td>
                    <!--</tr>-->
                </template>
            </v-data-table>
        </v-layout>
        <v-spacer></v-spacer>

        <v-layout row align-content-center justify-end xs7 offset-m2 class="customLayout-spacing">
            <v-flex xs3>
                <v-text-field
                        readonly
                        outline
                        label="Service fee amount in € for all shifts"
                        :value="serviceFee+ ' €'"
                        reverse
                ></v-text-field>
            </v-flex>
            <v-flex xs3>
                <v-text-field
                        readonly
                        outline
                        label="Total shift amount in €"
                        reverse

                        :value="shifts.reduce((acc,shift)=>{return acc+=shift.shift_price},0) + ' €'"
                ></v-text-field>
            </v-flex>
        </v-layout>
        <ShiftActionMenu v-if="workers && daysMultiplier"/>
        <ShiftCreateForm :daysMultiplicators="daysMultiplier" :workers="workers"/>
    </v-container>

</template>

<script>
    import axios from 'axios'
    import moment from 'moment'
    import Configuration from '../../configuration'
    import ShiftActionMenu from './ShiftActionMenu'
    import ShiftCreateForm from './ShiftCreateForm'

    const request = new axios.create({
        baseURL: Configuration.service.backendUrl
    })
    export default {
        components: {
            ShiftActionMenu,
            ShiftCreateForm
        },
        name: 'Shifts',
        props: {
            msg: String
        },
        data() {
            return {
                error: null,
                shifts: [],

                loading: false,
                selected: [],
                daysMultiplier: [],
                workersStatus: [],
                workers: [],
                serviceFee: null,

                headers: [
                    {
                        text: 'Planning ID',
                        align: 'left',
                        sortable: false,
                        value: '_id'
                    },
                    { text: 'User', value: 'user', sortable: true },
                    { text: 'Start date', value: 'start_date', sortable: false },
                    { text: 'End date', value: 'end_date', sortable: false },
                    { text: 'Duration (days)', value: 'duration', sortable: false },
                    { text: 'Shift cost €', value: 'shift_price', sortable: true }]
            }
        },
        methods: {
            formatDate(date) {
                return moment(date, 'YYYY-MM-DD HH:mm:ss.SSS').format('DD/MM/YYYY HH:mm')
            },
            loadShifts() {
                request.get('/shifts')
                    .then((payload) => {
                        this.error = null
                        const shifts = payload.data
                        shifts.forEach(shift => {
                            shift.duration = Math.round(moment
                                .duration(moment(shift.end_date, 'YYYY/MM/DD HH:mm:ss.SSS')
                                    .diff(moment(shift.start_date, 'YYYY/MM/DD HH:mm:ss.SSS'))
                                ).asDays().toFixed(2))
                        })
                        return shifts
                    })
                    .then(async (shifts) => {
                        this.serviceFee = await request.get('/pricing/fee').then(payload => payload.data.fee)
                        await this.getInfoWorkers()
                        let mappedWorkers
                        if (this.workers) {

                            mappedWorkers = this.workers.reduce((acc, worker) => {
                                acc[worker._id] = worker
                                return acc
                            }, {})
                            shifts.forEach(shift => {
                                const worker = mappedWorkers[shift.user_id]
                                shift.user = worker
                            })
                            this.shifts = shifts
                        }

                    })
                    .catch(async err => {
                        this.error = err.response.data
                        if (this.error === 'no shifts found') {
                            await this.getInfoWorkers()

                        }
                    })
            },
            async getInfoWorkers() {
                try {
                    const [workers, pricingDaysMultiplier, workersStatus] = await Promise.all([request.get('/workers').then(payload => payload.data).catch(err => {}), request.get('/pricing/days').then(payload => payload.data), request.get('/pricing/status').then(payload => payload.data)])
                    this.daysMultiplier = pricingDaysMultiplier
                    this.workersStatus = workersStatus
                    this.workers = workers
                } catch (err) {
                    console.log(err)
                }
            }

        },
        mounted() {
            // updateShiftList
            this.$root.$on('updateShiftList', this.loadShifts)
            this.loadShifts()

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .customLayout-spacing {
        margin-top: 2rem !important;
    }

    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
