var api = require('@atomist/api-cljs/atomist.middleware');

// create a block message here.  Can embed callbacks using the atomist_action.
var postWelcomeMessage = async (request, screenName) => {

   request.blockMessage(
     [{type: "section",
       text: {
         type: "mrkdwn",
         text: `Welcome ${screenName}`
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
     }],
     screenName
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

var doNothing = async (request) => {
   console.log(`User ${request.data.UserJoinedChannel[0].user.screenName} joined channel ${request.data.UserJoinedChannel[0].channel.name}`);
}

exports.handler = api.handler(
   {
     OnChatUser: async (request) => {
       if (!request.testMode) {
         await postWelcomeMessage( request, request.data.ChatId[0].screenName );
       }
     },
     "test-command": async (request) => {
       postWelcomeMessage( request, request.source.slack.user.name)
     },
     callback: buttonCallback,
     UserJoinedChannel: doNothing
   }
);
