const moment =require('moment')
function formatmsg(){
     return{
       
        time:moment().format('h:mm a')
     }
}
module.exports=formatmsg