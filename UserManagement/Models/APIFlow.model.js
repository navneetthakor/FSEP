const mongoose = require('mongoose');
const {Schema} = mongoose;

const APIFlowSchema = new Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,  // Reference to User
        ref: 'User',
        required: true,
    },

    api_flow_name: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: 'R',
        //U : unkonwn, R: Running, P: Pushed, 'D': Destroyed
        enum: ['U', 'R', 'P', 'D'],
        required: true
    },

    nodes: [{
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['REQUEST', 'CONDITION'],
            required: true
        },
        properties: {
            url: {
              type: String,
            },
            method: {
              type: String,
              enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Extend as necessary
            },
            headers: {
              type: Map,
              of: String,
              default: {}
            },
            body: {
              type: mongoose.Schema.Types.Mixed,
              default: null
            },
            condition: {
                type: String,
            }
          },
        edges: [{
            source: {
                type:String,
                required: true
            },
            sourcePort: {
                type: String,
                required: true
            },
            target: {
                type: String,
                required: true
            },
            targetPort: {
                type: String,
                required: true
            }
        }]
    }],


    check_frequency: {
        type: String,

        /*
            HAFH: half Hours
            OH: one Hours
        */
        enum: ['HAFH', 'OH', 'THH', 'SXH', 'NNH','TWH','TFH'],
        required: true
    },

});

const APIFlow = mongoose.model('APIFlow', APIFlowSchema)

module.exports = APIFlow