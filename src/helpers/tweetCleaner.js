// Clean Up tweets to readable text

var self = module.exports = {
  sanitize: (tweet) => {
    let i = tweet.indexOf("RT")
    if (i != -1) {
      return "DROP"
    }
//    console.log(`TWEET ${tweet}`);
    let res = tweet.replace(/ +(?= )/g,'').replace(/AG/g, " Attorney General ").replace(/A G /g, " Attorney General ")
    res = res.replace(/ObamaCare/g, " Obama Care ").replace(/OC/g, " Obama Care ").replace(/OCare/g, " Obama Care ")

    res = res.replace(/\@/g, "at ").replace(/&amp;/g, "and").replace(/\#/g, "HASHTAG ").replace(/[^\w\s]/gi, ' ');
    i = res.indexOf("http")
    if (i != -1) {
      res = res.substring(0, res.indexOf("http"))
    }
    if (res.length <25){
      return "DROP"
    }
    res = res.replace(/nytimes/gi, "New York Times").replace(/foxandfriends/g, "Fox and Friends")
    res = res.replace(/ s /g, "'s ")
    res = res.replace(/ t /g, "'t ")
    res = res.replace(/ 000 /g, ",000 ")
    res = res.replace(/seanhannity/g, "Sean Hannity").replace(/ +(?= )/g,'');
    return res
  }
}
