const Twit = require('twit');
const spintax = require('mel-spintax');
const fetch = require('node-fetch');

// Configure the twitter access API to Twit
const T = new Twit({
    consumer_key:         process.env.C_KEY,
    consumer_secret:      process.env.C_SECRET,
    access_token:         process.env.A_TOKEN,
    access_token_secret:  process.env.A_SECRETY,
})

// Save the day to the last tweet
let last_tweet_date = '2020-07-10T16:20:00';

// Get the last post date via Wordpress Rest API
async function check_last_post() {
    let today = new Date();
    console.log(`Starting bot ${today}`);

    // Check if the bot already have tweeted today
    if (today.getDate() == new Date(last_tweet_date).getDate()) {
        console.log('Already tweeted today!');
    }else{
        console.log('Getting last post...');
        let last_post = await(await fetch('https://www.ahnegao.com.br/wp-json/wp/v2/posts?per_page=1')).json();
        let last_post_date = last_post[0].date;
        console.log(`The last post date is ${last_post_date}`);

        // Check if the last post was posted today
        if (today.getDate() == new Date(last_post_date).getDate()) {
            console.log('Making Tweet...');
            await tweet(last_post_date);
        }else{
            console.log('The post is old');
        }
    }
}

async function tweet(last_post_date) {
    // Format the post publication hour to a 24h format. Ex: 16:20
    let options = {
        hour: 'numeric', minute: 'numeric',
        hour12: false,
    };
    let hour = new Intl.DateTimeFormat('pt-BR', options).format(new Date(last_post_date));

    // Define the tweet text using spintax format
    let text = `
{OS POSTS|POSTS|POSTAGENS|PUBLICAÇÕES} {ESTÃO NO|NO} {AR|AAAR|AAAAAAAAAAAAR|AAAAAAAAARRRRRRRRRR}{|!|!!|!!!|!!!!!!!!}

@ahnegao
ahnegao.com.br

⏰ {hoje o Joe postou|os posts sairam|posts sairam|posts publicados|os posts foram publicados} {as|por volta das} ${hour}`;
    
    let status = spintax.unspin(text);
    console.log(`Generated this tweet:
    ${status}`);

    // Post the generated tweet
    T.post('statuses/update', { status: status }, function(err, data) {
        console.log('Successfull tweeted!');
    })
}



// Call the function to check last post
// check_last_post()