var Q, accountSid, authToken, client, fromNumber, https, queryString, toNumbers, twiML, twilio;

accountSid = 'xxxxxxxxxxxxxxxxx';

authToken = 'xxxxxxxxxxxxxx';

fromNumber = '+81000000000000';

toNumbers = ['+8100000000000', '+8100000000000'];

twiML = '<Response>\n<Say language="ja-JP" voice="alice">アラート通知です。</Say>\n<Pause length="1" />\n<Say language="ja-JP" voice="alice">アラートですわ</Say>\n</Response>';

https = require('https');

queryString = require('querystring');

Q = require('q');

twilio = require('twilio');

client = new twilio.RestClient(accountSid, authToken);

exports.handler = function(event, context) {
  var i, len, promises, to;
  console.log('Start twilio call');
  promises = [];
  for (i = 0, len = toNumbers.length; i < len; i++) {
    to = toNumbers[i];
    promises.push(client.makeCall({
      from: fromNumber,
      to: to,
      url: "http://twimlets.com/echo?Twiml=" + (queryString.escape(twiML))
    }));
  }
  Q.allSettled(promises).then(function() {
    var arg, args, j, len1;
    args = [].slice.apply(arguments);
    for (j = 0, len1 = args.length; j < len1; j++) {
      arg = args[j];
      if (arg.state === 'rejected') {
        context.done(null, "Call failed! Reason: " + arg.reason);
        return;
      }
    }
    return context.done(null, 'Call succeeded.');
  });
};
