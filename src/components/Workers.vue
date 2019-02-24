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
                    :items="workers"
                    :loading="loading"
                    :rows-per-page-items="[100]"
            >
                <template slot="no-data">
                    <v-alert :value="true" color="warning" icon="warning">
                        No Workers founds
                    </v-alert>
                </template>
                <template slot="items" slot-scope="props">
                    <!--<tr :active="props.selected" @click="props.selected = !props.selected">-->
                    <td class="text-xs-right">{{ props.item._id }}</td>
                    <td class="text-xs-right">{{ props.item.first_name|| '-' }}</td>
                    <td class="text-xs-right">{{ props.item.status|| '-' }}</td>
                    <td class="text-xs-right">{{ props.item.shift_price_per_day||'-' }}</td>
                    <!--</tr>-->
                </template>
            </v-data-table>
        </v-layout>
        <WorkersActionMenu v-if="workersStatus"/>
        <WorkerCreateForm :workersStatus="workersStatus"/>

    </v-container>
</template>

<script>
    import WorkersActionMenu from './WorkersActionMenu'
    import WorkerCreateForm from './WorkerCreateForm'

    import axios from 'axios'
    import Configuration from '../configuration'

    const request = new axios.create({
        baseURL: Configuration.service.backendUrl
    })
    export default {
        name: 'Workers',
        props: {},
        components: {
            WorkersActionMenu,
            WorkerCreateForm
        },
        data() {
            return {
                error: null,
                selected: [],
                loading: false,
                workersStatus: [],
                workers: [],
                headers: [
                    {
                        text: 'Worker ID',
                        align: 'left',
                        sortable: false,
                        value: '_id'
                    },
                    { text: 'Name', value: 'first_name', sortable: false },
                    { text: 'Status', value: 'status', sortable: false },
                    { text: 'Price per day', value: 'shift_price_per_day', sortable: false }]
            }
        },
        async mounted() {
            this.getInfoWorkersStatus()
            this.$root.$on('updateWorkersList', this.loadWorkers)
            this.loadWorkers()
        },
        methods: {
            async getInfoWorkersStatus() {
                const workersStatus = await request.get('/pricing/status').then(payload => payload.data)
                this.workersStatus = workersStatus
            },
            async loadWorkers() {
                this.workers = await request.get('/workers').then(payload => payload.data).catch(err => {
                    this.error = err.response.data
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
