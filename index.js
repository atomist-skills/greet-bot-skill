var api = require('@atomist/api-cljs/atomist.middleware');

// create a block message here.  Can embed callbacks using the atomist_action.
var postWelcomeMessage = async (request) => {
   request.blockMessage(
     [{type: "section",
       text: {
         type: "mrkdwn",
         text: `Welcome ${request.source.slack.user.name}`
       },
       accessory: {
         type: "button",
         atomist_action: {id: "callback", parameters: []},
         text: {
           type: "plain_text",
           text: "say hi back!"
         },
         value: "you'll get this data back in the callback!"
       }
     }]
   );
}

// this is a callback so this will update the previous message if it's clicked.
var buttonCallback = async (request) => {
    request.blockMessage(
     [{
        type: "section",
         text: {
           type: "mrkdwn",
           text: `Awesome to meet you!`
         }
     }]
    );
}

exports.handler = api.handler(
   {
     OnChatUser: (request) => {
       if (!request.testMode) {
         postWelcomeMessage(request);
       }
     },
     "test-command": postWelcomeMessage,
     callback: buttonCallback
   }
);

exports.handler(
//  {
//    correlation_id: "corrid",
//    team: {id: "T095SFFBK"},
//    command: "test-command",
//    api_version: "1",
//    source: {
//      slack: {
//        team: {
//          id: "asdf"
//        },
//        user: {
//          name: "slimslenderslacks"
//        }
//      }
//    }
//  },
  {
    data: {},
    extensions: {
      operationName: "OnChatUser",
      correlation_id: "corrid",
      team_id: "T095SFFBK"
    }
  },
  (obj) => {console.info(`MOCK:  ${JSON.stringify(obj)}`);}
);
