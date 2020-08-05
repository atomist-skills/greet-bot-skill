var api = require('@atomist/api-cljs/atomist.middleware');

var view = {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Problem Summary"
    },
    blocks: [
      {
        type: "input",
        block_id: "block1",
        label: {
          type: "plain_text",
          text: "Help!"
        },
        element: {
          type: "plain_text_input",
          action_id: "input1",
          placeholder: {
            type: "plain_text",
            text: "Type in here"
          },
          multiline: true
        },
        optional: false
      }
    ],
    close: {
      type: "plain_text",
      text: "Cancel"
    },
    submit: {
      type: "plain_text",
      text: "Submit"
    },
    private_metadata: ""
}


// create a block message here.  Can embed callbacks using the atomist_action.
var postWelcomeMessage = async (request, screenName) => {

   request.blockMessage([
     {type: "section",
       text: {
         type: "mrkdwn",
         text: `Hi ${screenName} :wave:`
       }
     },
     {
       type: "section",
       text: {
         type: "mrkdwn",
         text: `Great to see you here! You've been automatically invited to several channels. Check out #welcome for the lay of the land of this Slack workspace. Bring any questions you have or topics for discussion to #help or #general. We're all here to help each other and we want to hear what you're interested in and how we can help.`
        },
     },
     {
       type: "section",
       text: {
         type: "mrkdwn",
         text: `We want to hear about the problems that you're looking to solve with event-driven automation. Drop us a few lines if there's something you'd like to see in our catalog.`
       },
       accessory: {
        type: "button",
        atomist_modal: {id: "callback", 
                        parameters: [{name: "view",
                                      value: JSON.stringify(view)}]},
        text: {
          type: "plain_text",
          text: "I'm interested in"
        },
        value: "up to 2000 character"
      }
     }],
     screenName);
}

// this is a callback so this will update the previous message if it's clicked.
// use #greet-bot-feedback
var buttonCallback = async (request) => {

  try {
    await request.blockMessage(
      [{type: "section",
        text: {type: "mrkdwn",
              text: `\`\`\`${request.stateValues.block1.input1.value}\`\`\``}}],
      "#greet-bot-feedback"
    );
  } catch(err) {
    console.error("failed to send greet-bot-feedback");
    console.error(err);
  }

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
         await postWelcomeMessage( request, `@${request.data.ChatId[0].screenName}`);
       }
     },
     "test-command": async (request) => {
       postWelcomeMessage( request, `@${request.source.slack.user.name}`);
     },
     callback: buttonCallback,
     UserJoinedChannel: doNothing
   }
);
