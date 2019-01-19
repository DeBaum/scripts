import http from "http";
import url from "url";

http.request({
  hostname: "",
  port: 80,
  path: "",
  method: "GET",
  ...url.parse("http://x3ap-eng.x3tc.net/x3_albion_prelude_map/sector.php?c=NTc4NDM"),
  headers: {
    "GET": "/x3_albion_prelude_map/sector.php?c=NTc4NDM HTTP/1.1",
    "Host": "x3ap-eng.x3tc.net",
    "Connection": "keep-alive",
    "Cache-Control": "max-age=0",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.183 Safari/537.36 Vivaldi/1.96.1147.64",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Referer": "http://x3ap-eng.x3tc.net/x3_albion_prelude_map/ware-list.php?s=advanced",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "en-US,en;q=0.9",
    "Cookie": "__cfduid=dbdb84055e7f2f044f46fdbe914ea5cd41535563659",
  }
}, (res) => {
  let txt = "";
  res.on("data", (data) => {
    txt += data;
  });

  res.on("end", () => {
    console.log(txt);
  })
});