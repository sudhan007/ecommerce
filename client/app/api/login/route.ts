import axios from "axios";

export async function POST(request: Request) {
  console.log(request, "request");
  // const body = await request.json();

  // let token = body.token;
  // try {
  //   let response = await axios({
  //     method: "post",
  //     url: "https://auth.otpless.app/auth/userInfo",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     data: {
  //       token,
  //       client_id: "I28KG9G1D52ZBXQMNK57HTJRTG579HRJ",
  //       client_secret: "vydxtqrujycus5khgfnoikeonxx4njrs",
  //     },
  //   });

  //   if (response.data) {
  //     return new Response(JSON.stringify(response.data));
  //   }

  //   return new Response(JSON.stringify({ ok: false }));
  // } catch (error) {
  //   console.log(error);
  //   return new Response(JSON.stringify({ ok: false }));
  // }

  return new Response(JSON.stringify({ ok: true }));
}

export async function OPTIONS(request: Request) {}
