const { setInterval, setTimeout } = require('timers');

const fs = require( 'fs' ),
      path = require( 'path' ),
      Twit = require( 'twit' ),
      config = require( path.join( __dirname, 'config.js' ) );


const T = new Twit( config );

function tweetImage(pokeNum){
    /* First, read the content of the images folder. */

    fs.readdir( __dirname + '/images', function( err, files ){
        if ( err ){
            console.log( 'error:', err );
            return;
        }
        else{
            let images = [];

            files.forEach( function( f ){
                images.push( f );
            } );

            /* Then pick a random image. */

            console.log( 'opening an image...' );

            const imagePath = path.join( __dirname, '/images/' + images[pokeNum]),
                imageData = fs.readFileSync( imagePath, { encoding: 'base64' } );

            /* Upload the image to Twitter. */

            console.log( 'uploading an image...', imagePath );

            T.post( 'media/upload', { media_data: imageData }, function ( err, data, response ){
                if ( err ){
                    console.log( 'error:', err );
                }
                else{
                    /* Add image description. */
                    
                    const image = data;
                    console.log( 'image uploaded, adding description...' );

                    T.post( 'media/metadata/create', {
                        media_id: image.media_id_string,
                        alt_text: {
                            text: 'Describe the image'
                        }            
                    }, function( err, data, response ){

                        /* And finally, post a tweet with the image. */

                        T.post( 'statuses/update', {
                            // status: 'Optional tweet text.',
                            media_ids: [image.media_id_string]
                        },
                        function( err, data, response){
                            if (err){
                                console.log( 'error:', err );
                            }
                            else{
                                console.log( 'posted an image!' );

                                /*
                                    After successfully tweeting, we can delete the image.
                                    Keep this part commented out if you want to keep the image and reuse it later.
                                */

                                // fs.unlink( imagePath, function( err ){
                                //   if ( err ){
                                //     console.log( 'error: unable to delete image ' + imagePath );
                                //   }
                                //   else{
                                //     console.log( 'image ' + imagePath + ' was deleted' );
                                //   }
                                // } );
                            }
                        } );
                    } );
                }
            } );
        }
    });
}

var pokeNum = 0;
// tweetImage(pokeNum)
while(pokeNum < 6){
    setTimeout(tweetImage, 1000*10, pokeNum);
    console.log(pokeNum);
    pokeNum+=1;
}