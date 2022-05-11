"use strict";

const DbMixin = require("../mixins/db.mixin");
const infoCities = require("../data/cities-canada-usa.json");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
    name: "autocomplete",
    version: 1,

    /**
     * Mixins
     */
    mixins: [DbMixin("autocomplete")],

    /**
    * Settings
    */
    settings: {
        fields: [
            "_id",
            "name",
            "ascii",
            "alt_name",
            "lat",
            "long",
            "feat_class",
            "feat_code",
            "country",
            "cc2",
            "admin1",
            "admin2",
            "admin3",
            "admin4",
            "population",
            "elevation",
            "dem",
            "tz",
            "modified_at"
        ],
    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        /**
         * The "moleculer-db" mixin registers the following actions:
         *  - list
         *  - find
         *  - count
         *  - create
         *  - insert
         *  - update
         *  - remove
         */

        // --- ADDITIONAL ACTIONS ---

        /**
         * Increase the quantity of the product item.
         */
        search: {
            rest: {
                method: "GET",
                path: "/search"
            },
            async handler(ctx) {
                var all = await this.adapter.find();

                // parameters
                var name = ctx.params.q;
                var lat = parseInt(ctx.params.latitude);
                var long = ctx.params.longitude;

                // filtering
                var search = all.filter(city => {
                    const regex = new RegExp(`^${name}`, 'gi');
                    return city.name.match(regex);
                });

                // mapping
                search = search.map(e => {
                    return {
                        name: e.name,
                        latitude: e.lat,
                        longitude: e.long
                    };
                });
                return { search };
            }
        },
    },

    /**
     * Events
     */
    events: {},

    /**
     * Methods
     */
    methods: {
        /**
         * Loading sample data to the collection.
         * It is called in the DB.mixin after the database
         * connection establishing & the collection is empty.
         */
        async seedDB() {
            var total = infoCities.length;
            await this.adapter.insertMany(infoCities);
        }
    }
};
